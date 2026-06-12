// api/webhook.js  ·  ABYSS // SURVIVORS  ·  Telegram group launcher (V3 foundation)
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('ABYSS relay alive');
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const BOT = process.env.TELEGRAM_BOT_USERNAME || 'AbyssSurvivorsbot';
  const APP = process.env.TELEGRAM_APP_NAME || 'play';
  try {
    const u = req.body || {};
    const msg = u.message || u.channel_post;
    if (msg && msg.text && TOKEN) {
      const t = msg.text.split('@')[0].trim();
      if (t === '/game' || t === '/start' || t === '/play') {
        // group_<id> rides into the Mini App as start_param, which the game reads
        // to link the group inside Social -> Group Members (roster relay comes later)
        const startapp = msg.chat && msg.chat.type !== 'private' ? `group_${msg.chat.id}` : 'solo';
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: msg.chat.id,
            text: '🌊 ABYSS // SURVIVORS\nSomething lives at 18,000 meters. It has noticed your light.',
            reply_markup: { inline_keyboard: [[{ text: '⬇️ DESCEND', url: `https://t.me/${BOT}/${APP}?startapp=${startapp}` }]] }
          })
        });
      }
    }
  } catch (e) {}
  res.status(200).json({ ok: true });
};
