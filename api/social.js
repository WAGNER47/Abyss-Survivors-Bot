// api/social.js  ·  ABYSS // SURVIVORS  ·  Friend system + presence + DURABLE STATS relay (V7)
// V7: durable CAPTAIN XP. The server now accrues captain XP per unique run (same ledger that
// counts games played), stores it in stats.capXp / stats.cap, and returns light stats with the
// friends list so ranks render instantly. Fixes: captain progression was silently dropped by
// the V6 stats whitelist, so it never persisted and never reached friends.

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

const maxNum = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);

// Captain XP for one run — MUST mirror the client's captainRunXP() formula exactly.
function runXP(r) {
  if (!r) return 0;
  const lvl = Number(r.level) || 1, kills = Number(r.kills) || 0, boss = Number(r.boss) || 0,
        elite = Number(r.elite) || 0, corr = Number(r.corruption) || 0, t = Number(r.time) || 0,
        win = (r.result === 'Victory') ? 1 : 0;
  return Math.round(lvl * 9 + kills * 0.6 + boss * 45 + elite * 7 + corr * 30 + t / 5 + win * 300);
}

// Merge incoming stats over stored stats. Cumulative / best-ever counters never go down,
// so a stale client (e.g. after a relaunch where its local cache reset) can never erase progress.
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
    cap:      maxNum(prev.cap,      incoming.cap),      // captain LEVEL (monotonic)
    // capXp is OWNED by the sync accrual below (ledger-based); mergeStats only carries it forward.
    capXp:    Number(prev.capXp) || 0,
    // descriptive fields: take the latest non-empty, else keep previous
    main:     incoming.main     != null ? incoming.main     : (prev.main || '\u2014'),
    axes:     incoming.axes     || prev.axes     || [],
    favEl:    incoming.favEl    || prev.favEl    || [],
    favRe:    incoming.favRe    || prev.favRe    || [],
    favGear:  incoming.favGear  || prev.favGear  || [],
    perDiver: incoming.perDiver || prev.perDiver || []
    // .total is filled in below with the monotonic games-played count
  };
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
      hint: HAS_KV ? 'Relay is wired. Friends and durable stats will work.' : 'No Redis credentials found. Add a Redis integration from the Vercel Marketplace, connect it to this project, then redeploy. See SOCIAL_SETUP.md.'
    });
  }

  if (!HAS_KV) return send(res, { ok: false, relay: 'offline', note: 'KV not configured. Open /api/social?action=health' });

  try {
    const now = Date.now();

    if (action === 'sync') {
      const me = String(body.id || '');
      if (!me) return send(res, { ok: false });
      const prev = (await jget('p:' + me)) || {};

      // ---- DURABLE STATS ----
      const inStats = body.stats || {};
      const mergedStats = mergeStats(prev.stats || {}, inStats);

      // run-id ledger: every run date we have ever seen (kept separate from the presence
      // timestamp 'seen'). 'rids' lets us count each run exactly once, even though the client
      // re-sends its recent runs on every sync.
      const rids = Array.isArray(prev.rids) ? prev.rids.slice() : [];
      const ridSet = new Set(rids.map(String));
      const firstContact = (prev.gamesPlayed == null); // pre-V6 / brand-new record
      let gamesPlayed = Number(prev.gamesPlayed) || 0;

      // ---- DURABLE CAPTAIN XP (ledger-accrued) ----
      // Seed once from the client's best-known total (which already includes the runs in this
      // payload), then grow incrementally: every genuinely NEW run id adds its exact run XP.
      // Finally floor at the client's number so no legitimate local progress is ever lost.
      const capSeeding = ((prev.stats && prev.stats.capXp) == null); // first time V7 sees this profile
      let capXp = Number(prev.stats && prev.stats.capXp) || 0;
      if (capSeeding) capXp = Number(inStats.capXp) || 0;

      const inRuns = Array.isArray(body.runs) ? body.runs : [];
      if (firstContact) {
        // Seed ONCE from the client's local sample (which already includes the runs being sent),
        // then register those run ids WITHOUT counting them so we don't double up. From here on
        // the count is tracked purely incrementally via the ledger.
        gamesPlayed = Number(inStats.total) || 0;
        for (const r of inRuns) { const d = r && r.date != null ? String(r.date) : null; if (d && !ridSet.has(d)) { ridSet.add(d); rids.push(d); } }
      } else {
        // Every genuinely new run date increments the durable counter exactly once.
        for (const r of inRuns) { const d = r && r.date != null ? String(r.date) : null; if (d && !ridSet.has(d)) { ridSet.add(d); rids.push(d); gamesPlayed++; if (!capSeeding) capXp += runXP(r); } }
      }
      // A client can legitimately know MORE XP than the ledger (e.g. runs older than its sync
      // window, or the profile predates V7): take the max. Never additive, so never double-counts.
      capXp = Math.max(capXp, Number(inStats.capXp) || 0);
      mergedStats.capXp = capXp;

      // Merge the run records themselves (newest first), preferring the richer copy on collision.
      const byDate = {};
      const prevRuns = Array.isArray(prev.runs) ? prev.runs : [];
      for (const r of prevRuns) if (r && r.date != null) byDate[String(r.date)] = r;
      for (const r of inRuns)   if (r && r.date != null) byDate[String(r.date)] = Object.assign({}, byDate[String(r.date)] || {}, r);
      const mergedRuns = Object.values(byDate).sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 60);

      // The authoritative games-played count is exposed as stats.total for the client to display.
      mergedStats.total = gamesPlayed;

      const prof = {
        id: me,
        name: body.name || prev.name || 'Survivor',
        username: body.username || prev.username || '',
        photo: body.photo || prev.photo || '',
        about: body.about != null ? body.about : (prev.about || ''),
        stats: mergedStats,
        runs: mergedRuns,
        gamesPlayed,
        rids: rids.slice(-500),   // bound the ledger
        seen: now                 // PRESENCE timestamp (unchanged name, used by friends/group online checks)
      };
      await jset('p:' + me, prof);

      const fids = (await jget('f:' + me)) || [];
      const friends = [];
      for (const fid of fids) {
        const fp = await jget('p:' + fid);
        if (fp) {
          const fs = fp.stats || {};
          friends.push({ id: fp.id, name: fp.name, username: fp.username, photo: fp.photo, online: (now - (fp.seen || 0)) < 70000, lastSeen: fp.seen || 0,
            stats: { cap: fs.cap || 0, capXp: fs.capXp || 0, level: fs.level || 0, kills: fs.kills || 0, wins: fs.wins || 0, total: fs.total || 0, timeIn: fs.timeIn || 0, maxCorr: fs.maxCorr || 0 } });
        }
      }
      const inbox = (await jget('r:' + me)) || [];
      // Return the durable numbers so the client can display + re-cache them.
      return send(res, { ok: true, relay: 'online', friends, inboxCount: inbox.length, stats: mergedStats, runs: mergedRuns });
    }

    if (action === 'profile') {
      const p = await jget('p:' + String(q.id || body.id || ''));
      return send(res, { ok: !!p, profile: p || null });
    }

    if (action === 'request') {
      const me = String(body.id || ''), target = String(body.target || '');
      if (!me || !target || me === target) return send(res, { ok: false, note: 'bad ids' });
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
