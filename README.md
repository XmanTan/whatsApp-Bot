# WhatsApp Menu OCR Bot

A cloud-deployable WhatsApp bot that extracts menu text from images using Google Vision OCR, formats it using an LLM, and sends the result (image + processed text) to Telegram.

## Features
- Image-based menu extraction
- Automatic menu vs food image detection
- Buffer-based image handling (no disk storage)
- Telegram notification with image + formatted text
- Cloud-ready deployment
- Environment variable configuration

## System Architecture
1. WhatsApp → Buffer (RAM) → Google Vision OCR → LLM Processing → Telegram
2. User sends 2 images
3. Images stored temporarily in memory (Buffer)
4. OCR extracts text
5. LLM formats structured output
6. Telegram receives image + formatted menu
Raw OCR text is formatted into:
DD/MM/YY - Muslim Breakfast/Lunch/Dinner Set A/B
Dish 1
Dish 2

## Tech Stack
- Node.js
- whatsapp-web.js
- Google Cloud Vision API
- LLM API (configurable)
- node-telegram-bot-api
- PM2 (production process manager)
- Google Cloud VM (Ubuntu)

## Project Structure
```
.
├── index.js
├── services/
│   ├── ocr.js
│   ├── llm.js
│   └── telegram.js
├── .env
├── package.json
└── README.md
⚙️ Environment Variables
```

## Run Steps
1. Create a env variables:
- ALLOWED_SENDER=whatsapp_number@c.us
- TELEGRAM_BOT_TOKEN=your_token
- TELEGRAM_CHAT_ID=your_chat_id
- OPENAI_API_KEY=your_llm_key
2. Google Vision Setup
- Create a Google Cloud project
- Enable Vision API
- Create a Service Account
- Download JSON key
- Place it in project root