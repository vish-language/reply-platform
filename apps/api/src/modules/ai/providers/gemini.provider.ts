import { GoogleGenAI } from "@google/genai";

import type { AIProvider } from "./ai.provider.js";

import type {
  GenerateReplyInput,
  GenerateReplyResult,
} from "../types/ai.types.js";

export class GeminiProvider implements AIProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateReply(input: GenerateReplyInput): Promise<GenerateReplyResult> {
    const response = await this.client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: input.comment,
      config: {
        systemInstruction: `
You are an AI assistant that writes replies to customer comments.

Tone: ${input.tone}
Language: ${input.language}

Additional instructions:
${input.instructions ?? "None"}

Write a helpful, natural and concise response.
Do not mention that you are an AI.
          `,
      },
    });

    return {
      content: response.text ?? "",
      provider: "gemini",
      model: "gemini-1.5-flash",
    };
  }
}
