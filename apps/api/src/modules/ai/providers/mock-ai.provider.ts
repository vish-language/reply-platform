import type { AIProvider } from "./ai.provider.js";

import type {
  GenerateReplyInput,
  GenerateReplyResult,
} from "../types/ai.types.js";

export class MockAIProvider implements AIProvider {
  async generateReply(input: GenerateReplyInput): Promise<GenerateReplyResult> {
    return {
      content: "Mock reply",
      provider: "mock",
      model: "mock-model",
    };
  }
}
