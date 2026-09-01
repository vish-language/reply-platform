import type {
  GenerateReplyInput,
  GenerateReplyResult,
} from "../types/ai.types.js";

export interface AIProvider {
  generateReply(
    input: GenerateReplyInput,
  ): Promise<GenerateReplyResult>;
}