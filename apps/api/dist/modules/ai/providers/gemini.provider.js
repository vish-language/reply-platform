import { GoogleGenAI } from "@google/genai";
export class GeminiProvider {
    client;
    constructor() {
        this.client = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }
    async generateReply(input) {
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
//# sourceMappingURL=gemini.provider.js.map