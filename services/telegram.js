const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

async function sendToTelegram(text, imageBuffer) {
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!imageBuffer) {
    // fallback: just text
    await bot.sendMessage(chatId, text);
    return;
  }

  // Send photo with text as caption
  await bot.sendPhoto(chatId, imageBuffer, {
    caption: text
  });
}

module.exports = { sendToTelegram };