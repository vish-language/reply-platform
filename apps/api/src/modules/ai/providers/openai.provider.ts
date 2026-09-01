import OpenAI from "openai";

import type { AIProvider } from "./ai.provider.js";

import type {
  GenerateReplyInput,
  GenerateReplyResult,
} from "../types/ai.types.js";

export class OpenAIProvider implements AIProvider {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateReply(input: GenerateReplyInput): Promise<GenerateReplyResult> {
    const response = await this.client.responses.create({
      model: "gpt-5-mini",
      instructions: `
You are an AI assistant that writes replies to customer comments.

Tone: ${input.tone}
Language: ${input.language}

Additional instructions:
${input.instructions ?? "None"}

Write a helpful, natural, concise response.
Do not mention that you are an AI.
        `,
      input: input.comment,
    });

    return {
      content: response.output_text,
      provider: "openai",
      model: "gpt-4o-mini",
    };
  }
}
