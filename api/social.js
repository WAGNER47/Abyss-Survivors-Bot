// api/social.js  ·  ABYSS // SURVIVORS  ·  Friend system + presence relay (V4)
//
// Uses Vercel KV (free tier) for storage. Set it up in 2 minutes:
//   Vercel dashboard -> your project -> Storage -> Create Database -> KV -> connect.
//   That auto-adds KV_REST_API_URL and KV_REST_API_TOKEN to your env. Redeploy.
//
// If KV is not configured the endpoint still responds {ok:false,relay:'offline'}
// so the game shows "relay offline" instead of breaking.
//
// One file, many actions, chosen by ?action= :
//   sync      · upsert my profile + heartbeat presence, returns my friends with live status
//   profile   · fetch one player's public profile by id
//   request   · send a friend request from me to target id
//   inbox     · list my pending incoming requests
//   respond   · accept or decline a request
//   group     · register that a telegram group launched the game (roster relay)

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOK = process.env.KV_REST_API_TOKEN;
const HAS_KV = !!(KV_URL && KV_TOK);

async function kv(cmd) {
  // cmd is an array like ['SET','key','val'] sent to the Upstash/Vercel KV REST API
  const r = await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOK}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  return j.result;
}
const jget = async (k) => { try { const v = await kv(['GET', k]); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
const jset = (k, v) => kv(['SET', k, JSON.stringify(v)]);

function send(res, obj) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).json(obj);
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, { ok: true });
  const q = req.query || {};
  const body = req.method === 'POST' ? (req.body || {}) : q;
  const action = q.action || body.action || '';

  if (!HAS_KV) return send(res, { ok: false, relay: 'offline', note: 'KV not configured' });

  try {
    const now = Date.now();

    if (action === 'sync') {
      const me = String(body.id || '');
      if (!me) return send(res, { ok: false });
      // upsert public profile + presence
      const prof = {
        id: me,
        name: body.name || 'Survivor',
        username: body.username || '',
        photo: body.photo || '',
        about: body.about || '',
        stats: body.stats || {},
        seen: now
      };
      await jset('p:' + me, prof);
      // build friends list with live status
      const fids = (await jget('f:' + me)) || [];
      const friends = [];
      for (const fid of fids) {
        const fp = await jget('p:' + fid);
        if (fp) {
          const ago = now - (fp.seen || 0);
          friends.push({
            id: fp.id, name: fp.name, username: fp.username, photo: fp.photo,
            online: ago < 70000,
            lastSeen: fp.seen || 0
          });
        }
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
      if (!me || !target || me === target) return send(res, { ok: false });
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
