import "dotenv/config";

import { OpenAIProvider } from "../providers/openai.provider.js";

const provider = new OpenAIProvider();

const result =
  await provider.generateReply({
    comment:
      "I really love your product!",
    tone: "professional",
    language: "English",
    instructions:
      "Keep the reply short and friendly.",
  });

console.log(result);