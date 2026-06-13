// api/social.js  ·  ABYSS // SURVIVORS  ·  Friend system + presence relay (V5, hardened)
// Works with ANY Vercel Redis / Upstash integration. It reads whichever env var

const URL_CANDIDATES = ['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL', 'REDIS_REST_API_URL'];
const TOK_CANDIDATES = ['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN', 'REDIS_REST_API_TOKEN'];

function pick(cands) { for (const k of cands) { if (process.env[k]) return { key: k, val: process.env[k] }; } return null; }
const URLENV = pick(URL_CANDIDATES);
const TOKENV = pick(TOK_CANDIDATES);
const KV_URL = URLENV && URLENV.val;
const KV_TOK = TOKENV && TOKENV.val;
const HAS_KV = !!(KV_URL && KV_TOK);

// Upstash REST: POST the command array to the base URL with a Bearer token.
async function kv(cmd) {
  const r = await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + KV_TOK, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  if (!r.ok) throw new Error('KV HTTP ' + r.status);
  const j = await r.json();
  return j.result;
}
const jget = async (k) => { try { const v = await kv(['GET', k]); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
const jset = (k, v) => kv(['SET', k, JSON.stringify(v)]);

function send(res, obj) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(obj);
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, { ok: true });
  const q = req.query || {};
  const body = req.method === 'POST' ? (req.body || {}) : q;
  const action = q.action || body.action || '';

  // --- health: a human-readable diagnostic so setup is never a guessing game ---
  if (action === 'health') {
    let ping = 'not attempted';
    if (HAS_KV) {
      try { await kv(['SET', 'abyss:health', String(Date.now())]); const v = await kv(['GET', 'abyss:health']); ping = v ? 'READ/WRITE OK' : 'connected but no value'; }
      catch (e) { ping = 'ERROR: ' + (e && e.message); }
    }
    return send(res, {
      ok: HAS_KV && ping === 'READ/WRITE OK',
      relay: HAS_KV ? 'configured' : 'offline',
      urlVar: URLENV ? URLENV.key : null,
      tokenVar: TOKENV ? TOKENV.key : null,
      ping,
      hint: HAS_KV ? 'Relay is wired. Friends will work.' : 'No Redis credentials found. Add a Redis integration from the Vercel Marketplace, connect it to this project, then redeploy. See SOCIAL_SETUP.md.'
    });
  }

  if (!HAS_KV) return send(res, { ok: false, relay: 'offline', note: 'KV not configured. Open /api/social?action=health' });

  try {
    const now = Date.now();

    if (action === 'sync') {
      const me = String(body.id || '');
      if (!me) return send(res, { ok: false });
      const prev = (await jget('p:' + me)) || {};
      const prof = {
        id: me,
        name: body.name || prev.name || 'Survivor',
        username: body.username || prev.username || '',
        photo: body.photo || prev.photo || '',
        about: body.about != null ? body.about : (prev.about || ''),
        stats: body.stats || prev.stats || {},
        seen: now
      };
      await jset('p:' + me, prof);
      const fids = (await jget('f:' + me)) || [];
      const friends = [];
      for (const fid of fids) {
        const fp = await jget('p:' + fid);
        if (fp) friends.push({ id: fp.id, name: fp.name, username: fp.username, photo: fp.photo, online: (now - (fp.seen || 0)) < 70000, lastSeen: fp.seen || 0 });
      }
      const inbox = (await jget('r:' + me)) || [];
      return send(res, { ok: true, relay: 'online', friends, inboxCount: inbox.length });
    }

    if (action === 'profile') {
      const p = await jget('p:' + String(q.id || body.id || ''));
      return send(res, { ok: !!p, profile: p || null });
    }

    if (action === 'request') {
      const me = String(body.id || ''), target = String(body.target || '');
      if (!me || !target || me === target) return send(res, { ok: false, note: 'bad ids' });
      // already friends?
      const myFriends = (await jget('f:' + me)) || [];
      if (myFriends.includes(target)) return send(res, { ok: true, already: true });
      const myProf = await jget('p:' + me);
      const inbox = (await jget('r:' + target)) || [];
      if (!inbox.find(x => x.id === me)) {
        inbox.push({ id: me, name: (myProf && myProf.name) || me, username: (myProf && myProf.username) || '', t: now });
        await jset('r:' + target, inbox);
      }
      return send(res, { ok: true });
    }

    if (action === 'inbox') {
      const me = String(q.id || body.id || '');
      const inbox = (await jget('r:' + me)) || [];
      return send(res, { ok: true, requests: inbox });
    }

    if (action === 'respond') {
      const me = String(body.id || ''), from = String(body.from || ''), accept = !!body.accept;
      let inbox = (await jget('r:' + me)) || [];
      inbox = inbox.filter(x => x.id !== from);
      await jset('r:' + me, inbox);
      if (accept) {
        const a = (await jget('f:' + me)) || [];
        const b = (await jget('f:' + from)) || [];
        if (!a.includes(from)) { a.push(from); await jset('f:' + me, a); }
        if (!b.includes(me)) { b.push(me); await jset('f:' + from, b); }
      }
      return send(res, { ok: true });
    }

    if (action === 'unfriend') {
      const me = String(body.id || ''), other = String(body.other || '');
      let a = (await jget('f:' + me)) || []; a = a.filter(x => x !== other); await jset('f:' + me, a);
      let b = (await jget('f:' + other)) || []; b = b.filter(x => x !== me); await jset('f:' + other, b);
      return send(res, { ok: true });
    }

    if (action === 'group') {
      const gid = String(q.group || body.group || '');
      const me = String(body.id || '');
      if (gid && me) {
        const roster = (await jget('g:' + gid)) || [];
        if (!roster.includes(me)) { roster.push(me); await jset('g:' + gid, roster.slice(-200)); }
      }
      const roster = gid ? ((await jget('g:' + gid)) || []) : [];
      const members = [];
      for (const mid of roster.slice(-50)) {
        const mp = await jget('p:' + mid);
        if (mp) members.push({ id: mp.id, name: mp.name, photo: mp.photo, online: (now - (mp.seen || 0)) < 70000 });
      }
      return send(res, { ok: true, relay: 'online', members });
    }

    return send(res, { ok: false, note: 'unknown action' });
  } catch (e) {
    return send(res, { ok: false, error: String(e && e.message) });
  }
};
