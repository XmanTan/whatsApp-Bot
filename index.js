require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

const { extractTextFromImage } = require("./services/ocr");
const { processMenuWithLLM } = require("./services/llm");
const { sendToTelegram } = require("./services/telegram");

const ALLOWED_SENDER = process.env.ALLOWED_SENDER;

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp bot is ready.");
});

client.on("message", async message => {
  try {
    console.log("Received message from:", message.from);
    if (message.from !== ALLOWED_SENDER) return;

    // If message is text, prompt user to send an image
    if (message.type === "chat") {
      // await message.reply("Please send an image of the menu or food instead of text.");
      return;
    }

    // Only process images
    if (!message.hasMedia) {
      await message.reply("Unsupported message type. Please send an image.");
      return;
    }

    const media = await message.downloadMedia();
    if (!media.mimetype.startsWith("image")) return;

    const buffer = Buffer.from(media.data, "base64");
    const fileName = `image_${Date.now()}.jpg`;
    const imagePath = path.join(__dirname, fileName);
    fs.writeFileSync(imagePath, buffer);

    // Store image temporarily in memory list
    if (!global.imageBuffer) global.imageBuffer = [];
    global.imageBuffer.push(imagePath);

    // Wait until 2 images received
    if (global.imageBuffer.length < 2) {
      message.reply("Received image. Waiting for second image...");
      return;
    }

    message.reply("Processing both images...");

    const [img1, img2] = global.imageBuffer;

    const text1 = await extractTextFromImage(img1);
    const text2 = await extractTextFromImage(img2);

    // Determine which is menu
    const menuImage = text1.length > text2.length ? img1 : img2;
    const foodImage = text1.length > text2.length ? img2 : img1;
    const menuText = text1.length > text2.length ? text1 : text2;

    console.log("Menu Image:", menuImage);
    console.log("Food Image:", foodImage);
    message.reply(menuText);

    // Send menu text to LLM
    const processedMenu = await processMenuWithLLM(menuText);

    await message.reply("Menu detected and processed:");
    await message.reply(processedMenu);

    // Send Menu to telegram
    sendToTelegram(processedMenu);

    // Reset buffer
    global.imageBuffer = [];

  } catch (error) {
    console.error(error);
    message.reply("Error processing images.");
  }
});

client.initialize();