import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL,
});

const response = await client.chat.completions.create({
  model: "meta/llama-3.1-8b-instruct",
  messages: [
    {
      role: "user",
      content: "Say hello and explain that you are running through NVIDIA."
    }
  ],
});

console.log(response.choices[0].message.content);
