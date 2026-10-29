import { prisma } from "../../../database/prisma.js";
export class ReplyRepository {
    static async create(data) {
        return prisma.reply.create({
            data: {
                commentId: data.commentId,
                content: data.content,
                status: "GENERATED",
                generatedBy: data.generatedBy,
                modelName: data.modelName,
            },
        });
    }
    static async findByCommentId(commentId) {
        return prisma.reply.findMany({
            where: {
                commentId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async findById(commentId) {
        return prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });
    }
    static async updateStatus(replyId, status) {
        return prisma.reply.update({
            where: {
                id: replyId,
            },
            data: {
                status,
            },
        });
    }
}
//# sourceMappingURL=reply.repository.js.map