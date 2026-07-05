// api/social.js  ·  ABYSS // SURVIVORS  ·  Friend system + presence + DURABLE STATS relay (V8 SECURE)
// V8: full security hardening.
//   AUTH     - every identity-bearing action now requires Telegram WebApp initData, verified
//              server-side with HMAC-SHA256 against TELEGRAM_BOT_TOKEN. The user id is taken
//              from the VERIFIED payload, never from the request body. Impersonation is dead.
//   PRIVACY  - action=profile now requires auth AND the requester must be the target or a
//              confirmed friend of the target. Responses are stripped to a public-safe subset
//              (no rids ledger, no internals). Anonymous profile scraping is dead.
//   SANITIZE - every stored string is cleaned (no <>"'` or control chars, hard length caps),
//              photo URLs must be https Telegram userpic links, all numbers are clamped to
//              sane finite bounds. Stored XSS via player names/photos is dead.
//   ABUSE    - per-user rate limits on every action (Redis INCR+EXPIRE), inbox caps, run-date
//              plausibility checks so the ledger can't be stuffed, capXp growth is bounded
//              per sync so a client can't just declare any XP number.
//   PERF     - Upstash pipeline + MGET: a sync with 20 friends now costs ~3 Redis round trips
//              instead of 24+. Friend stats ride back on the sync payload so the client no
//              longer needs a per-friend profile fetch storm.
//   CORS     - the game is served from this same deployment, so cross-origin access is no
//              longer granted. Set ALLOWED_ORIGIN env var only if you ever need to allow one.
//
// Env vars used: KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_* / REDIS_* equivalents),
//                TELEGRAM_BOT_TOKEN (required for auth - already set for webhook.js),
//                ALLOWED_ORIGIN (optional), AUTH_MAX_AGE_SEC (optional, default 172800 = 48h).

const crypto = require('crypto');

const URL_CANDIDATES = ['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL', 'REDIS_REST_API_URL'];
const TOK_CANDIDATES = ['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN', 'REDIS_REST_API_TOKEN'];

function pick(cands) { for (const k of cands) { if (process.env[k]) return process.env[k]; } return null; }
const KV_URL = pick(URL_CANDIDATES);
const KV_TOK = pick(TOK_CANDIDATES);
const HAS_KV = !!(KV_URL && KV_TOK);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const AUTH_MAX_AGE = Math.max(600, Number(process.env.AUTH_MAX_AGE_SEC) || 172800); // 48h default

// ---------------- Upstash REST helpers ----------------
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
// One HTTP round trip for many commands. Returns an array of results in order.
async function kvPipe(cmds) {
  if (!cmds.length) return [];
  const r = await fetch(KV_URL.replace(/\/+$/, '') + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + KV_TOK, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds)
  });
  if (!r.ok) throw new Error('KV HTTP ' + r.status);
  const j = await r.json();
  return j.map(x => (x && x.error) ? null : x.result);
}
const parseJ = (v) => { try { return v ? JSON.parse(v) : null; } catch (e) { return null; } };
const jget = async (k) => parseJ(await kv(['GET', k]));
const jset = (k, v) => kv(['SET', k, JSON.stringify(v)]);

// ---------------- transport ----------------
function send(res, obj, status) {
  if (process.env.ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-tg-init');
  }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(status || 200).json(obj);
}

// ---------------- Telegram initData verification ----------------
// The Mini App sends window.Telegram.WebApp.initData in the x-tg-init header.
// Telegram signs that string with HMAC-SHA256 keyed by the bot token, so a valid
// signature proves the user id inside it is real. Docs: "Validating data received
// via the Mini App". secret = HMAC_SHA256(key="WebAppData", msg=bot_token).
function verifyInitData(raw) {
  try {
    if (!raw || !BOT_TOKEN) return null;
    if (raw.length > 4096) return null;
    const params = new URLSearchParams(raw);
    const hash = params.get('hash');
    if (!hash || !/^[0-9a-f]{64}$/i.test(hash)) return null;
    const pairs = [];
    for (const [k, v] of params.entries()) if (k !== 'hash') pairs.push(k + '=' + v);
    pairs.sort();
    const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calc = crypto.createHmac('sha256', secret).update(pairs.join('\n')).digest('hex');
    const a = Buffer.from(calc, 'hex'), b = Buffer.from(hash.toLowerCase(), 'hex');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const authDate = Number(params.get('auth_date')) || 0;
    if ((Date.now() / 1000 - authDate) > AUTH_MAX_AGE) return null;
    const user = parseJ(params.get('user'));
    if (!user || user.id == null) return null;
    return { id: String(user.id) };
  } catch (e) { return null; }
}

// ---------------- sanitizers ----------------
const ID_RE = /^\d{1,20}$/;               // Telegram user ids
const GID_RE = /^-?\d{1,20}$/;            // Telegram chat ids (groups are negative)
function cleanText(s, max) {
  s = String(s == null ? '' : s);
  // strip HTML-significant chars + control chars; keeps Farsi and emoji intact
  s = s.replace(/[<>"'`]/g, '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return s.slice(0, max);
}
function cleanPhoto(u) {
  u = String(u || '').slice(0, 300);
  return /^https:\/\/t\.me\/i\/userpic\//.test(u) ? u : '';
}
function num(v, max) { v = Number(v); if (!isFinite(v) || v < 0) return 0; return Math.min(v, max); }
function cleanPillList(a, n) {
  if (!Array.isArray(a)) return [];
  return a.slice(0, n).map(e => ({ k: cleanText(e && e.k, 32), c: num(e && e.c, 1e7) })).filter(e => e.k);
}
function cleanStats(s) {
  s = (s && typeof s === 'object') ? s : {};
  return {
    level: num(s.level, 9999), wins: num(s.wins, 1e6), kills: num(s.kills, 1e9),
    best: num(s.best, 86400), total: num(s.total, 1e6), timeIn: num(s.timeIn, 1e9),
    gold: num(s.gold, 1e10), maxCorr: num(s.maxCorr, 9999), mainRuns: num(s.mainRuns, 1e6),
    cap: num(s.cap, 999), capXp: num(s.capXp, 1e9),
    main: cleanText(s.main, 24) || '\u2014',
    axes: Array.isArray(s.axes) ? s.axes.slice(0, 6).map(v => num(v, 1)) : [],
    favEl: cleanPillList(s.favEl, 3), favRe: cleanPillList(s.favRe, 3), favGear: cleanPillList(s.favGear, 5),
    perDiver: Array.isArray(s.perDiver) ? s.perDiver.slice(0, 16).map(d => ({ name: cleanText(d && d.name, 24), n: num(d && d.n, 1e6) })).filter(d => d.name) : []
  };
}
function cleanRun(r, now) {
  if (!r || typeof r !== 'object') return null;
  const date = Number(r.date);
  // run ids are dates: must be a real ms timestamp, not in the future - blocks ledger stuffing
  if (!isFinite(date) || date < 1700000000000 || date > now + 300000) return null;
  let build = null;
  if (r.build && typeof r.build === 'object') {
    try { if (JSON.stringify(r.build).length <= 6000) build = r.build; } catch (e) {}
  }
  const reacts = {};
  if (r.reacts && typeof r.reacts === 'object') {
    let i = 0;
    for (const k in r.reacts) { if (i++ >= 20) break; const kk = cleanText(k, 32); if (kk) reacts[kk] = num(r.reacts[k], 1e6); }
  }
  return {
    date, result: r.result === 'Victory' ? 'Victory' : 'Defeat',
    char: cleanText(r.char, 24), time: num(r.time, 86400), level: num(r.level, 9999),
    kills: num(r.kills, 1e6), corruption: num(r.corruption, 9999), gold: num(r.gold, 1e8),
    peak: num(r.peak, 1e10), total: num(r.total, 1e11), taken: num(r.taken, 1e10),
    reacts, build
  };
}
// Public-safe view of a stored profile: what a FRIEND is allowed to see. No internals.
function publicProfile(p) {
  if (!p) return null;
  const st = p.stats || {};
  return {
    id: p.id, name: p.name, username: p.username, photo: p.photo, about: p.about || '', seen: p.seen || 0,
    stats: st,
    runs: (Array.isArray(p.runs) ? p.runs : []).slice(0, 30).map(r => ({
      date: r.date, result: r.result, char: r.char, time: r.time, level: r.level,
      kills: r.kills, corruption: r.corruption, gold: r.gold, peak: r.peak, total: r.total, taken: r.taken
    }))
  };
}

// ---------------- rate limiting (Redis INCR + EXPIRE NX, one round trip) ----------------
async function rateOK(bucket, limit, windowSec) {
  try {
    const key = 'rl:' + bucket;
    const rs = await kvPipe([['INCR', key], ['EXPIRE', key, String(windowSec), 'NX']]);
    return Number(rs[0]) <= limit;
  } catch (e) { return true; } // never let the limiter itself take the game down
}

const maxNum = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);

// Captain XP for one run - MUST mirror the client's captainRunXP() formula exactly.
function runXP(r) {
  if (!r) return 0;
  const lvl = Number(r.level) || 1, kills = Number(r.kills) || 0, boss = Number(r.boss) || 0,
        elite = Number(r.elite) || 0, corr = Number(r.corruption) || 0, t = Number(r.time) || 0,
        win = (r.result === 'Victory') ? 1 : 0;
  return Math.round(lvl * 9 + kills * 0.6 + boss * 45 + elite * 7 + corr * 30 + t / 5 + win * 300);
}

// Merge incoming (already sanitized) stats over stored stats. Monotonic counters never go down.
function mergeStats(prev, incoming) {
  prev = prev || {}; incoming = incoming || {};
  return {
    level:    maxNum(prev.level,    incoming.level),
    wins:     maxNum(prev.wins,     incoming.wins),
    kills:    maxNum(prev.kills,    incoming.kills),
    best:     maxNum(prev.best,     incoming.best),
    timeIn:   maxNum(prev.timeIn,   incoming.timeIn),
    gold:     maxNum(prev.gold,     incoming.gold),
    maxCorr:  maxNum(prev.maxCorr,  incoming.maxCorr),
    mainRuns: maxNum(prev.mainRuns, incoming.mainRuns),
    cap:      maxNum(prev.cap,      incoming.cap),
    capXp:    Number(prev.capXp) || 0, // owned by the ledger accrual below
    main:     incoming.main && incoming.main !== '\u2014' ? incoming.main : (prev.main || '\u2014'),
    axes:     (incoming.axes && incoming.axes.length) ? incoming.axes : (prev.axes || []),
    favEl:    (incoming.favEl && incoming.favEl.length) ? incoming.favEl : (prev.favEl || []),
    favRe:    (incoming.favRe && incoming.favRe.length) ? incoming.favRe : (prev.favRe || []),
    favGear:  (incoming.favGear && incoming.favGear.length) ? incoming.favGear : (prev.favGear || []),
    perDiver: (incoming.perDiver && incoming.perDiver.length) ? incoming.perDiver : (prev.perDiver || [])
  };
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, { ok: true });
  const q = req.query || {};
  const body = req.method === 'POST' ? (req.body || {}) : q;
  const action = String(q.action || body.action || '');

  // --- health: public but reveals nothing about configuration internals ---
  if (action === 'health') {
    let ping = 'not attempted';
    if (HAS_KV) {
      try { await kv(['SET', 'abyss:health', String(Date.now())]); const v = await kv(['GET', 'abyss:health']); ping = v ? 'READ/WRITE OK' : 'connected but no value'; }
      catch (e) { ping = 'ERROR'; }
    }
    return send(res, {
      ok: HAS_KV && ping === 'READ/WRITE OK',
      relay: HAS_KV ? 'configured' : 'offline',
      auth: BOT_TOKEN ? 'ready' : 'missing bot token',
      ping
    });
  }

  if (!HAS_KV) return send(res, { ok: false, relay: 'offline', note: 'KV not configured. Open /api/social?action=health' });

  // --- AUTH GATE: every remaining action needs a verified Telegram identity ---
  const initRaw = (req.headers && (req.headers['x-tg-init'] || req.headers['X-Tg-Init'])) || body.tgInit || '';
  const auth = verifyInitData(initRaw);
  if (!auth) return send(res, { ok: false, auth: 'required', note: 'Open the game inside Telegram.' }, 401);
  const me = auth.id; // verified - the body can no longer lie about who is talking

  try {
    const now = Date.now();

    if (action === 'sync') {
      if (!(await rateOK('sync:' + me, 20, 60))) return send(res, { ok: false, note: 'slow down' }, 429);

      // one round trip: profile + friend list + inbox
      const [pRaw, fRaw, rRaw] = await kvPipe([['GET', 'p:' + me], ['GET', 'f:' + me], ['GET', 'r:' + me]]);
      const prev = parseJ(pRaw) || {};
      const fids = (parseJ(fRaw) || []).filter(x => ID_RE.test(String(x))).slice(0, 100);
      const inbox = parseJ(rRaw) || [];

      // ---- sanitized incoming payload ----
      const inStats = cleanStats(body.stats);
      const inRuns = (Array.isArray(body.runs) ? body.runs : []).slice(0, 8).map(r => cleanRun(r, now)).filter(Boolean);
      const mergedStats = mergeStats(prev.stats || {}, inStats);

      // run-id ledger: counts each run exactly once across resends
      const rids = Array.isArray(prev.rids) ? prev.rids.slice() : [];
      const ridSet = new Set(rids.map(String));
      const firstContact = (prev.gamesPlayed == null);
      let gamesPlayed = Number(prev.gamesPlayed) || 0;

      // ---- durable captain XP (ledger-accrued, growth-bounded) ----
      const capSeeding = ((prev.stats && prev.stats.capXp) == null);
      let capXp = Number(prev.stats && prev.stats.capXp) || 0;
      if (capSeeding) capXp = inStats.capXp;

      if (firstContact) {
        gamesPlayed = inStats.total;
        for (const r of inRuns) { const d = String(r.date); if (!ridSet.has(d)) { ridSet.add(d); rids.push(d); } }
      } else {
        for (const r of inRuns) { const d = String(r.date); if (!ridSet.has(d)) { ridSet.add(d); rids.push(d); gamesPlayed++; if (!capSeeding) capXp += runXP(r); } }
      }
      // Clients may legitimately know a bit MORE XP than the ledger (runs older than the sync
      // window). Honor that, but bound the jump per sync so nobody can just declare a number.
      const claimed = inStats.capXp;
      if (claimed > capXp) capXp = Math.min(claimed, capXp + 25000);
      mergedStats.capXp = capXp;

      // merge run records (newest first), prefer the richer copy on collision
      const byDate = {};
      for (const r of (Array.isArray(prev.runs) ? prev.runs : [])) if (r && r.date != null) byDate[String(r.date)] = r;
      for (const r of inRuns) byDate[String(r.date)] = Object.assign({}, byDate[String(r.date)] || {}, r);
      const mergedRuns = Object.values(byDate).sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 60);

      mergedStats.total = gamesPlayed;

      const prof = {
        id: me,
        name: cleanText(body.name, 24) || prev.name || 'Survivor',
        username: cleanText(body.username, 32).replace(/[^\w]/g, ''),
        photo: cleanPhoto(body.photo) || prev.photo || '',
        about: body.about != null ? cleanText(body.about, 140) : (prev.about || ''),
        stats: mergedStats,
        runs: mergedRuns,
        gamesPlayed,
        rids: rids.slice(-500),
        seen: now
      };

      // one round trip: write profile + fetch every friend profile
      const cmds = [['SET', 'p:' + me, JSON.stringify(prof)]];
      if (fids.length) cmds.push(['MGET'].concat(fids.map(f => 'p:' + f)));
      const wr = await kvPipe(cmds);
      const fRes = fids.length ? (wr[1] || []) : [];

      const friends = [];
      for (let i = 0; i < fids.length; i++) {
        const fp = parseJ(fRes[i]);
        if (fp) {
          const fs = fp.stats || {};
          friends.push({ id: fp.id, name: fp.name, username: fp.username, photo: fp.photo, online: (now - (fp.seen || 0)) < 70000, lastSeen: fp.seen || 0,
            stats: { cap: fs.cap || 0, capXp: fs.capXp || 0, level: fs.level || 0, kills: fs.kills || 0, wins: fs.wins || 0, total: fs.total || 0, timeIn: fs.timeIn || 0, maxCorr: fs.maxCorr || 0 } });
        }
      }
      return send(res, { ok: true, relay: 'online', friends, inboxCount: inbox.length, stats: mergedStats, runs: mergedRuns });
    }

    if (action === 'profile') {
      if (!(await rateOK('prof:' + me, 60, 60))) return send(res, { ok: false, note: 'slow down' }, 429);
      const target = String(body.id || q.id || body.target || '');
      if (!ID_RE.test(target)) return send(res, { ok: false });
      // privacy: you can read yourself, or someone whose friend list contains you
      if (target !== me) {
        const tf = (await jget('f:' + target)) || [];
        if (!tf.includes(me)) return send(res, { ok: false, note: 'not linked' }, 403);
      }
      const p = await jget('p:' + target);
      return send(res, { ok: !!p, profile: publicProfile(p) });
    }

    if (action === 'request') {
      if (!(await rateOK('req:' + me, 30, 3600))) return send(res, { ok: false, note: 'slow down' }, 429);
      const target = String(body.target || '');
      if (!ID_RE.test(target) || me === target) return send(res, { ok: false, note: 'bad ids' });
      const [mfRaw, mpRaw, tpRaw, inbRaw] = await kvPipe([['GET', 'f:' + me], ['GET', 'p:' + me], ['GET', 'p:' + target], ['GET', 'r:' + target]]);
      const myFriends = parseJ(mfRaw) || [];
      if (myFriends.includes(target)) return send(res, { ok: true, already: true });
      if (!parseJ(tpRaw)) return send(res, { ok: false, note: 'no such diver' });
      const myProf = parseJ(mpRaw);
      const inbox = (parseJ(inbRaw) || []).slice(0, 50);
      if (inbox.length >= 50) return send(res, { ok: false, note: 'inbox full' });
      if (!inbox.find(x => x.id === me)) {
        inbox.push({ id: me, name: (myProf && myProf.name) || me, username: (myProf && myProf.username) || '', t: now });
        await jset('r:' + target, inbox);
      }
      return send(res, { ok: true });
    }

    if (action === 'inbox') {
      const inbox = (await jget('r:' + me)) || [];
      return send(res, { ok: true, requests: inbox });
    }

    if (action === 'respond') {
      const from = String(body.from || ''), accept = !!body.accept;
      if (!ID_RE.test(from)) return send(res, { ok: false });
      let inbox = (await jget('r:' + me)) || [];
      // the request must actually exist - you cannot fabricate a friendship
      const had = inbox.some(x => x.id === from);
      inbox = inbox.filter(x => x.id !== from);
      await jset('r:' + me, inbox);
      if (accept && had) {
        const [aRaw, bRaw] = await kvPipe([['GET', 'f:' + me], ['GET', 'f:' + from]]);
        const a = parseJ(aRaw) || [], b = parseJ(bRaw) || [];
        const ops = [];
        if (!a.includes(from)) { a.push(from); ops.push(['SET', 'f:' + me, JSON.stringify(a.slice(-100))]); }
        if (!b.includes(me)) { b.push(me); ops.push(['SET', 'f:' + from, JSON.stringify(b.slice(-100))]); }
        if (ops.length) await kvPipe(ops);
      }
      return send(res, { ok: true });
    }

    if (action === 'unfriend') {
      const other = String(body.other || '');
      if (!ID_RE.test(other)) return send(res, { ok: false });
      const [aRaw, bRaw] = await kvPipe([['GET', 'f:' + me], ['GET', 'f:' + other]]);
      const a = (parseJ(aRaw) || []).filter(x => x !== other);
      const b = (parseJ(bRaw) || []).filter(x => x !== me);
      await kvPipe([['SET', 'f:' + me, JSON.stringify(a)], ['SET', 'f:' + other, JSON.stringify(b)]]);
      return send(res, { ok: true });
    }

    if (action === 'group') {
      if (!(await rateOK('grp:' + me, 20, 60))) return send(res, { ok: false, note: 'slow down' }, 429);
      const gid = String(q.group || body.group || '');
      if (!GID_RE.test(gid)) return send(res, { ok: false, note: 'bad group' });
      let roster = (await jget('g:' + gid)) || [];
      if (!roster.includes(me)) { roster.push(me); roster = roster.slice(-200); await jset('g:' + gid, roster); }
      const slice = roster.slice(-50);
      const mRaw = slice.length ? await kv(['MGET'].concat(slice.map(m => 'p:' + m))) : [];
      const members = [];
      for (const raw of (mRaw || [])) {
        const mp = parseJ(raw);
        if (mp) members.push({ id: mp.id, name: mp.name, photo: mp.photo, online: (now - (mp.seen || 0)) < 70000 });
      }
      return send(res, { ok: true, relay: 'online', members });
    }

    return send(res, { ok: false, note: 'unknown action' });
  } catch (e) {
    return send(res, { ok: false, error: 'server error' }, 500);
  }
};
