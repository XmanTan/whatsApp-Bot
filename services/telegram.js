require("dotenv").config();
const axios = require("axios");

async function sendToTelegram(text) {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: text
    });

  } catch (error) {
    console.error("Telegram Error:", error.response?.data || error.message);
  }
}

module.exports = { sendToTelegram };