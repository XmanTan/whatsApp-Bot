const vision = require('@google-cloud/vision');
const path = require('path');

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'C:/Users/xaver/Programming/JavaScript/WABot/google-credentials.json'
});

async function extractTextFromImage(imagePath) {
  try {
    const [result] = await client.textDetection(imagePath);

    if (!result.textAnnotations || result.textAnnotations.length === 0) {
      return "";
    }

    return result.textAnnotations[0].description;

  } catch (error) {
    console.error("Google Vision OCR Error:", error);
    throw error;
  }
}

module.exports = { extractTextFromImage };