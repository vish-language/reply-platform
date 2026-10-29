import { ApiResponse } from "../../../common/utils/ApiResponse.js";
import { ReplyService } from "../services/reply.service.js";
export class ReplyController {
    static async create(req, res, next) {
        try {
            const result = await ReplyService.create(req.membership.organizationId, req.body);
            return ApiResponse.success(res, result, "Reply created successfully", 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async findByComment(req, res, next) {
        try {
            const commentId = req.params.commentId;
            if (Array.isArray(commentId)) {
                throw new Error("Invalid comment ID");
            }
            const result = await ReplyService.findByComment(req.membership.organizationId, commentId);
            return ApiResponse.success(res, result, "Replies fetched successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=reply.controller.js.map