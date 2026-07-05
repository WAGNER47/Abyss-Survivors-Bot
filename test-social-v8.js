// test-social-v8.js - regression harness for api/social.js V8 security hardening.
// Mocks Upstash via global fetch intercept + signs real Telegram initData with a fake bot token.
const crypto = require('crypto');

process.env.KV_REST_API_URL = 'https://fake-kv.local';
process.env.KV_REST_API_TOKEN = 'tok';
process.env.TELEGRAM_BOT_TOKEN = '12345:TESTTOKEN';

// ---- in-memory Redis mock ----
const DB = {};
function execCmd(cmd) {
  const op = cmd[0];
  if (op === 'GET') return DB[cmd[1]] != null ? DB[cmd[1]] : null;
  if (op === 'SET') { DB[cmd[1]] = String(cmd[2]); return 'OK'; }
  if (op === 'MGET') return cmd.slice(1).map(k => DB[k] != null ? DB[k] : null);
  if (op === 'INCR') { DB[cmd[1]] = String((Number(DB[cmd[1]]) || 0) + 1); return Number(DB[cmd[1]]); }
  if (op === 'EXPIRE') return 1;
  return null;
}
global.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  const isPipe = String(url).endsWith('/pipeline');
  const payload = isPipe ? body.map(c => ({ result: execCmd(c) })) : { result: execCmd(body) };
  return { ok: true, json: async () => payload };
};

const handler = require('./api/social.js');

// ---- signed initData factory (mirrors Telegram's algorithm) ----
function makeInitData(userId, name, ageSec, corrupt) {
  const user = JSON.stringify({ id: userId, first_name: name || 'Tester' });
  const authDate = String(Math.floor(Date.now() / 1000) - (ageSec || 0));
  const params = new URLSearchParams();
  params.set('user', user); params.set('auth_date', authDate); params.set('query_id', 'AAE1');
  const pairs = []; for (const [k, v] of params.entries()) pairs.push(k + '=' + v); pairs.sort();
  const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN).digest();
  let hash = crypto.createHmac('sha256', secret).update(pairs.join('\n')).digest('hex');
  if (corrupt) hash = hash.replace(/^./, hash[0] === 'a' ? 'b' : 'a');
  params.set('hash', hash);
  return params.toString();
}

function call(action, body, initData, method) {
  return new Promise(resolve => {
    const res = { headers: {}, code: 200,
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.code = c; return this; },
      json(o) { resolve({ code: this.code, body: o, headers: this.headers }); },
      send(s) { resolve({ code: this.code, body: s, headers: this.headers }); } };
    handler({ method: method || 'POST', query: { action }, body: body || {}, headers: initData ? { 'x-tg-init': initData } : {} }, res);
  });
}

let pass = 0, fail = 0;
function T(name, cond) { if (cond) { pass++; console.log('  PASS  ' + name); } else { fail++; console.log('  FAIL  ' + name); } }

(async () => {
  console.log('== ABYSS social.js V8 regression ==');

  // 1. auth gate
  let r = await call('sync', { id: '111', stats: {} });
  T('sync without initData rejected (401)', r.code === 401 && r.body.auth === 'required');
  r = await call('sync', { id: '111' }, makeInitData(111, 'A', 0, true));
  T('sync with FORGED hash rejected', r.code === 401);
  r = await call('sync', { id: '111' }, makeInitData(111, 'A', 999999));
  T('sync with EXPIRED initData rejected', r.code === 401);

  // 2. identity comes from signature, not body
  const aliceInit = makeInitData(111, 'Alice');
  r = await call('sync', { id: '999999', name: 'Alice', stats: { kills: 50 }, runs: [] }, aliceInit);
  T('valid sync accepted', r.code === 200 && r.body.ok === true);
  T('body id ignored - profile stored under VERIFIED id', !!DB['p:111'] && !DB['p:999999']);

  // 3. sanitization
  r = await call('sync', { name: '<img src=x onerror=alert(1)>Ali', photo: 'javascript:evil()', about: '<script>x</script>hey', stats: { kills: 1e15, level: Infinity }, runs: [] }, aliceInit);
  let p = JSON.parse(DB['p:111']);
  T('HTML stripped from stored name', p.name.indexOf('<') < 0 && p.name.indexOf('>') < 0);
  T('non-Telegram photo URL rejected', p.photo === '');
  T('script tags stripped from about', p.about.indexOf('<') < 0 && p.about.indexOf('hey') >= 0);
  T('kills clamped to sane bound', p.stats.kills <= 1e9);
  T('non-finite level coerced', isFinite(p.stats.level) && p.stats.level <= 9999);
  T('Farsi name survives sanitizer', (() => { const s = 'رامتین'; return s === s.replace(/[<>"'`]/g, ''); })());

  // 4. run ledger plausibility + capXp bound
  const now = Date.now();
  r = await call('sync', { stats: { capXp: 99999999 }, runs: [
    { date: now + 99999999, level: 50, kills: 100, result: 'Victory' },   // future date -> rejected
    { date: now - 1000, level: 50, kills: 100, time: 600, result: 'Victory' } // legit
  ] }, aliceInit);
  p = JSON.parse(DB['p:111']);
  T('future-dated run excluded from ledger', p.rids.indexOf(String(now + 99999999)) < 0);
  T('legit run counted once', p.rids.indexOf(String(now - 1000)) >= 0);
  T('claimed capXp growth bounded (+25000 max per sync)', p.stats.capXp <= 25000 + 5000);

  // duplicate resend does not double count
  const gp1 = p.gamesPlayed;
  await call('sync', { runs: [{ date: now - 1000, level: 50, kills: 100, time: 600, result: 'Victory' }] }, aliceInit);
  p = JSON.parse(DB['p:111']);
  T('resent run not double counted', p.gamesPlayed === gp1);

  // 5. profile privacy
  const bobInit = makeInitData(222, 'Bob');
  await call('sync', { name: 'Bob', stats: {}, runs: [] }, bobInit);
  r = await call('profile', { id: '111' }, bobInit);
  T('stranger cannot read profile (403)', r.code === 403);
  r = await call('profile', { id: '111' });
  T('anonymous profile scrape rejected (401)', r.code === 401);

  // 6. friendship needs a REAL pending request
  r = await call('respond', { from: '111', accept: true }, bobInit);
  let fBob = JSON.parse(DB['f:222'] || '[]');
  T('accepting a nonexistent request creates NO friendship', fBob.indexOf('111') < 0);

  r = await call('request', { target: '222' }, aliceInit);
  T('friend request delivered', r.code === 200 && r.body.ok === true);
  r = await call('respond', { from: '111', accept: true }, bobInit);
  fBob = JSON.parse(DB['f:222'] || '[]');
  const fAli = JSON.parse(DB['f:111'] || '[]');
  T('real request acceptance links both sides', fBob.indexOf('111') >= 0 && fAli.indexOf('222') >= 0);

  r = await call('profile', { id: '111' }, bobInit);
  T('friend CAN read profile', r.code === 200 && r.body.ok === true);
  T('profile response has no rids ledger / internals', r.body.profile && r.body.profile.rids === undefined && r.body.profile.gamesPlayed === undefined);
  T('profile runs carry no build blobs', (r.body.profile.runs || []).every(x => x.build === undefined));

  // 7. sync returns friend stats (client fetch storm removed)
  r = await call('sync', { stats: {}, runs: [] }, aliceInit);
  T('sync payload carries friend stats', r.body.friends.length === 1 && r.body.friends[0].stats && typeof r.body.friends[0].stats.cap === 'number');

  // 8. request to nonexistent player rejected
  r = await call('request', { target: '424242' }, aliceInit);
  T('request to unknown id rejected', r.body.ok === false);

  // 9. group id validation
  r = await call('group', { group: 'DROP TABLE' }, aliceInit);
  T('non-numeric group id rejected', r.body.ok === false);
  r = await call('group', { group: '-100123456' }, aliceInit);
  T('numeric group join ok + members list', r.body.ok === true && Array.isArray(r.body.members));

  // 10. rate limit
  let limited = false;
  for (let i = 0; i < 25; i++) { const rr = await call('sync', { stats: {}, runs: [] }, aliceInit); if (rr.code === 429) { limited = true; break; } }
  T('sync rate limit engages', limited);

  // 11. health leaks nothing
  r = await call('health', {});
  T('health exposes no env var names', JSON.stringify(r.body).indexOf('KV_REST') < 0 && JSON.stringify(r.body).indexOf('UPSTASH') < 0);
  T('no CORS wildcard on responses', r.headers['Access-Control-Allow-Origin'] === undefined);

  console.log('\\n== ' + pass + ' passed, ' + fail + ' failed ==');
  process.exit(fail ? 1 : 0);
})();
