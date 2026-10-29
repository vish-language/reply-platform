import OpenAI from "openai";
export class OpenAIProvider {
    client;
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async generateReply(input) {
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
//# sourceMappingURL=openai.provider.js.map