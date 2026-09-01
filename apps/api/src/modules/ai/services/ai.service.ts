import type { AIProvider } from "../providers/ai.provider.js";

import type {
  GenerateReplyInput,
  GenerateReplyResult,
} from "../types/ai.types.js";

import { AISettingsRepository } from "../../ai-settings/repositories/ai-settings.repository.js";

export class AIService {
  constructor(private readonly provider: AIProvider) {}

  async generateReply(data: {
    organizationId: string;
    comment: string;
  }): Promise<GenerateReplyResult> {
    const settings = await AISettingsRepository.findByOrganizationId(
      data.organizationId,
    );

    const input: GenerateReplyInput = {
      comment: data.comment,

      tone: settings?.tone ?? "professional",

      language: settings?.language ?? "English",

      instructions: settings?.instructions ?? null,
    };

    return this.provider.generateReply(input);
  }
}
