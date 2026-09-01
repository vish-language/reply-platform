import { prisma } from "../../../database/prisma.js";

export class CommentRepository {
  static async create(data: {
    organizationId: string;
    externalCommentId?: string;
    googleReviewName?: string;
    authorName: string;
    authorEmail?: string;
    content: string;
    rating?: number;
  }) {
    return prisma.comment.create({
      data,
    });
  }

  static async findAllByOrganization(organizationId: string) {
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
  static async findById(commentId: string) {
    return prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  }
  static async updateStatus(
    commentId: string,
    status: "PENDING" | "PROCESSING" | "REPLIED" | "FAILED",
  ) {
    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        status,
      },
    });
  }

  static async findByExternalId(
    organizationId: string,
    externalCommentId: string,
  ) {
    return prisma.comment.findFirst({
      where: {
        organizationId,
        externalCommentId,
      },
    });
  }
  static async findByIdWithReplies(id: string) {
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

  static async findAllWithReplies(organizationId: string) {
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
  static async findAllPaginated(
    organizationId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      rating?: number;
      search?: string;
    },
  ) {
    const { page, limit, status, rating, search } = options;

    const where: any = {
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
