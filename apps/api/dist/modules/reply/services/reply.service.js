import { ApiError } from "../../../common/errors/ApiError.js";
import { CommentRepository } from "../../comment/repositories/comment.repository.js";
import { ReplyRepository } from "../repositories/reply.repository.js";
export class ReplyService {
    static async create(organizationId, data) {
        const comment = await CommentRepository.findById(data.commentId);
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }
        if (comment.organizationId !== organizationId) {
            throw new ApiError(403, "Access Denied");
        }
        const reply = await ReplyRepository.create({
            commentId: data.commentId,
            content: data.content,
        });
        return {
            id: reply.id,
            commentId: reply.commentId,
            content: reply.content,
            status: reply.status,
            createdAt: reply.createdAt,
        };
    }
    static async findByComment(organizationId, commentId) {
        const comment = await CommentRepository.findById(commentId);
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }
        if (comment.organizationId !== organizationId) {
            throw new ApiError(403, "Access Denied");
        }
        return ReplyRepository.findByCommentId(commentId);
    }
}
//# sourceMappingURL=reply.service.js.map