import { ApiError } from "../../../common/errors/ApiError.js";
import { AISettingsRepository } from "../repositories/ai-settings.repository.js";
export class AISettingsService {
    static async getSettings(organizationId) {
        const settings = await AISettingsRepository.findByOrganizationId(organizationId);
        if (!settings) {
            throw new ApiError(404, "AI settings not found");
        }
        return {
            id: settings.id,
            organizationId: settings.organizationId,
            autoReplyEnabled: settings.autoReplyEnabled,
            tone: settings.tone,
            language: settings.language,
            instructions: settings.instructions,
        };
    }
    static async updateSettings(organizationId, data) {
        const existingSettings = await AISettingsRepository.findByOrganizationId(organizationId);
        if (!existingSettings) {
            throw new ApiError(404, "AI settings not found");
        }
        const settings = await AISettingsRepository.updateByOrganizationId(organizationId, data);
        return {
            id: settings.id,
            organizationId: settings.organizationId,
            autoReplyEnabled: settings.autoReplyEnabled,
            tone: settings.tone,
            language: settings.language,
            instructions: settings.instructions,
        };
    }
}
//# sourceMappingURL=ai-settings.service.js.map