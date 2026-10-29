import { ApiResponse } from "../../../common/utils/ApiResponse.js";
import { InvitationService } from "../services/invitation.service.js";
export class InvitationController {
    static async getInvitation(req, res, next) {
        try {
            const result = await InvitationService.getInvitation(req.params.token);
            return ApiResponse.success(res, result, "Invitation is valid", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=invitation.controller.js.map