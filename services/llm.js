require("dotenv").config();
const axios = require("axios");

async function processMenuWithLLM(menuText) {
  const d = new Date();
  let text = d.toLocaleDateString();

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: `Extract only the dish names.
                      Remove any numeric IDs.
                      Get Today's Date.
                      Return in this format:

                      DD/MM/YY - Muslim Breakfast/Lunch/Dinner
                      Dish 1
                      Dish 2
                      Dish 3

                      Do not add explanations and no repeating foods.`
          },
          {
            role: "user",
            content: text + " " + menuText
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("LLM Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { processMenuWithLLM };