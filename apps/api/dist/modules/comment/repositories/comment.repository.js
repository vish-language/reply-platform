import { prisma } from "../../../database/prisma.js";
export class CommentRepository {
    static async create(data) {
        return prisma.comment.create({
            data,
        });
    }
    static async findAllByOrganization(organizationId) {
        return prisma.comment.findMany({
            where: {
                organizationId,
            },
            include: {
                replies: true,
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
    static async updateStatus(commentId, status) {
        return prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                status,
            },
        });
    }
    static async findByExternalId(organizationId, externalCommentId) {
        return prisma.comment.findFirst({
            where: {
                organizationId,
                externalCommentId,
            },
        });
    }
    static async findByIdWithReplies(id) {
        return prisma.comment.findUnique({
            where: {
                id,
            },
            include: {
                replies: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
    }
    static async findAllWithReplies(organizationId) {
        return prisma.comment.findMany({
            where: {
                organizationId,
            },
            include: {
                replies: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    static async findAllPaginated(organizationId, options) {
        const { page, limit, status, rating, search } = options;
        const where = {
            organizationId,
        };
        if (status) {
            where.status = status;
        }
        if (rating) {
            where.rating = rating;
        }
        if (search) {
            where.OR = [
                {
                    content: {
                        contains: search,
                    },
                },
                {
                    authorName: {
                        contains: search,
                    },
                },
            ];
        }
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                include: {
                    replies: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.comment.count({
                where,
            }),
        ]);
        return {
            comments,
            total,
        };
    }
}
//# sourceMappingURL=comment.repository.js.map