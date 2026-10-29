import { OrganizationService } from "../services/organization.service.js";
import { ApiResponse } from "../../../common/utils/ApiResponse.js";
export class OrganizationController {
    static async current(req, res, next) {
        try {
            const result = await OrganizationService.getCurrentOrganization(req.user.userId);
            return ApiResponse.success(res, result, "Organization fetched successfully", 200);
        }
        catch (error) {
            next(error);
        }
        const result = await OrganizationService.updateCurrentOrganization(req.user.userId, req.body);
        return ApiResponse.success(res, result, "Organization updated successfully");
    }
    static async update(req, res, next) {
        try {
            const result = await OrganizationService.getCurrentOrganization(req.user.userId);
            return ApiResponse.success(res, result, "Organization fetched successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=organization.controller.js.map