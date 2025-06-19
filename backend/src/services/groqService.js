const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const promptTemplate = (description) => `
You are an AI assistant. Based on the following project description, generate 3 user stories in the format:

As a [role], I want to [action], so that [benefit].

Project Description: ${description}
`;

async function generateUserStories(description) {
  const prompt = promptTemplate(description);

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-70b-8192",
  });

  const text = chatCompletion.choices[0].message.content;
  const lines = text.split("\n").filter((line) => line.startsWith("As a")).map((line) => line.replace(/\*\*/g, ""));

  return lines;
}

module.exports = { generateUserStories };