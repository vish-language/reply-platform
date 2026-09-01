import { prisma } from "../../../database/prisma.js";

export class ReplyRepository {
  static async create(data: {
    commentId: string;
    content: string;
    generatedBy?: string;
    modelName?: string;
  }) {
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
  

  static async findByCommentId(commentId: string) {
    return prisma.reply.findMany({
      where: {
        commentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  static async findById(commentId: string) {
    return prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }
  static async updateStatus(
    replyId: string,
    status: "GENERATED" | "PUBLISHED" | "FAILED",
  ) {
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
