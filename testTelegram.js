require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
  console.log('Chat ID:', msg.chat.id);
  console.log('Message text:', msg.text);
});

axios.post(
  `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
  {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: "Hello, this is a test message!"
  }
);