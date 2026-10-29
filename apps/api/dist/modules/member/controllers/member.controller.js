import { ApiResponse } from "../../../common/utils/ApiResponse.js";
import { MemberService } from "../services/member.service.js";
export class MemberController {
    static async add(req, res, next) {
        try {
            const result = await MemberService.addMember(req.membership.organizationId, req.body);
            const message = result.type === "INVITATION"
                ? "Invitation created successfully"
                : "Member added successfully";
            return ApiResponse.success(res, result, message, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const result = await MemberService.listMembers(req.membership.organizationId);
            return ApiResponse.success(res, result, "Members fetched successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const result = await MemberService.updateMember(req.membership.organizationId, req.params.membershipId, req.body);
            return ApiResponse.success(res, result, "Member updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await MemberService.removeMember(req.membership.organizationId, req.params.membershipId);
            return ApiResponse.success(res, null, "Member removed successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=member.controller.js.map