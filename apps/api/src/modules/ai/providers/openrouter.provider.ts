import OpenAI from "openai";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: "https://openrouter.ai/api/v1",

  // 'httpAgent' is not part of the official ClientOptions type; cast to any
  // to allow passing the custom https.Agent for environments with self-signed certs.
  httpAgent: httpsAgent,
} as any);

export class OpenRouterProvider {
  async generateReply(data: {
    comment: string;
    tone: string;
    language: string;
    instructions?: string | null;
  }) {
    const prompt = `
You are a professional customer review response assistant.

Generate ONLY the reply that should be sent to the customer.

Do not include:
- safety labels
- analysis
- explanations
- JSON
- moderation results

Review:

${data.comment}

Tone:
${data.tone}

Language:
${data.language}

Additional instructions:
${data.instructions ?? ""}
`;

    const response = await client.chat.completions.create({
      model: "openrouter/free",

      messages: [
        {
          role: "system",
          content: "You write customer review replies only.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let content = response.choices?.[0]?.message?.content;

    // fallback for models that return empty content
    if (!content) {
      const choice: any = response.choices?.[0];

      content = choice?.text ?? choice?.message?.reasoning ?? "";
    }

    content = (content ?? "").trim();

    if (!content) {
      throw new Error("AI returned empty reply content");
    }
    console.log("OPENROUTER RAW RESPONSE:", JSON.stringify(response, null, 2));

    return {
      content,

      provider: "OpenRouter",

      model: "openrouter/free",
    };
  }
}
