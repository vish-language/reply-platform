import { AISettingsRepository } from "../../ai-settings/repositories/ai-settings.repository.js";
export class AIService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async generateReply(data) {
        const settings = await AISettingsRepository.findByOrganizationId(data.organizationId);
        const input = {
            comment: data.comment,
            tone: settings?.tone ?? "professional",
            language: settings?.language ?? "English",
            instructions: settings?.instructions ?? null,
        };
        return this.provider.generateReply(input);
    }
}
//# sourceMappingURL=ai.service.js.map