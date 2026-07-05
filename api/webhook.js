// api/webhook.js  ·  ABYSS // SURVIVORS  ·  Telegram group launcher (V4 SECURE)
// V4: webhook authenticity. If TELEGRAM_WEBHOOK_SECRET is set, incoming updates must carry
// the matching X-Telegram-Bot-Api-Secret-Token header (set the same secret when you call
// setWebhook with secret_token=...). Without it, anyone who finds this URL can inject fake
// updates and make the bot post into chats. Backwards compatible: if the env var is unset,
// behavior is unchanged - but set it.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('ABYSS relay alive');
  const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';
  if (SECRET) {
    const got = (req.headers && req.headers['x-telegram-bot-api-secret-token']) || '';
    if (got !== SECRET) return res.status(401).json({ ok: false });
  }
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const BOT = process.env.TELEGRAM_BOT_USERNAME || 'AbyssSurvivorsbot';
  const APP = process.env.TELEGRAM_APP_NAME || 'play';
  try {
    const u = req.body || {};
    const msg = u.message || u.channel_post;
    if (msg && msg.text && TOKEN) {
      const t = msg.text.split('@')[0].trim();
      if (t === '/game' || t === '/start' || t === '/play') {
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
