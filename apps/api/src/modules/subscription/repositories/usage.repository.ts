import { prisma } from "../../../database/prisma.js";

export class UsageRepository {
  static async incrementAIReplies(organizationId: string, limit: number) {
    const month = new Date().toISOString().slice(0, 7);

    console.log("ATOMIC AI REPLY USAGE CHECK:", organizationId, month, limit);

    return prisma.$transaction(async (tx) => {
      await tx.usage.upsert({
        where: {
          organizationId_month: {
            organizationId,
            month,
          },
        },

        update: {},

        create: {
          organizationId,
          month,
          reviewsProcessed: 0,
          aiRepliesGenerated: 0,
        },
      });

      const updatedRows = await tx.$executeRaw`
        UPDATE usage
        SET aiRepliesGenerated = aiRepliesGenerated + 1
        WHERE organizationId = ${organizationId}
          AND month = ${month}
          AND aiRepliesGenerated < ${limit}
      `;

      if (updatedRows === 0) {
        throw new Error(`AI reply limit reached ${limit}/${limit}`);
      }

      const usage = await tx.usage.findUnique({
        where: {
          organizationId_month: {
            organizationId,
            month,
          },
        },
      });

      console.log("AI REPLY USAGE UPDATED:", usage);

      return usage;
    });
  }

  static async incrementReviews(organizationId: string) {
    console.log("INCREMENT REVIEWS FOR ORGANIZATION:", organizationId);

    const month = new Date().toISOString().slice(0, 7);

    console.log("USAGE MONTH:", month);

    const result = await prisma.usage.upsert({
      where: {
        organizationId_month: {
          organizationId,
          month,
        },
      },

      update: {
        reviewsProcessed: {
          increment: 1,
        },
      },

      create: {
        organizationId,
        month,
        reviewsProcessed: 1,
        aiRepliesGenerated: 0,
      },
    });

    console.log("UPDATED REVIEW USAGE:", result);

    return result;
  }
}
