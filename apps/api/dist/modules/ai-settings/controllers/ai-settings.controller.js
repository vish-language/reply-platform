import { ApiResponse } from "../../../common/utils/ApiResponse.js";
import { AISettingsService } from "../services/ai-settings.service.js";
export class AISettingsController {
    static async get(req, res, next) {
        try {
            const result = await AISettingsService.getSettings(req.membership.organizationId);
            return ApiResponse.success(res, result, "AI settings fetched successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const result = await AISettingsService.updateSettings(req.membership.organizationId, req.body);
            return ApiResponse.success(res, result, "AI settings updated successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=ai-settings.controller.js.map