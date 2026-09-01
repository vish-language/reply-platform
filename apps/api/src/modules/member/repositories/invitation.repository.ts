import { prisma } from "../../../database/prisma.js";

export class InvitationRepository {
  static async findPendingByEmail(organizationId: string, email: string) {
    return prisma.invitation.findFirst({
      where: {
        organizationId,
        email: email.toLowerCase(),
        acceptedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  static async create(data: {
    organizationId: string;
    email: string;
    name: string;
    role: "ADMIN" | "MEMBER";
    token: string;
    expiresAt: Date;
  }) {
    return prisma.invitation.create({
      data: {
        organizationId: data.organizationId,
        email: data.email.toLowerCase(),
        name: data.name,
        role: data.role,
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
  }

  static async findByToken(token: string) {
    return prisma.invitation.findUnique({
      where: {
        token,
      },
      include: {
        organization: true,
      },
    });
  }

  static async markAccepted(id: string) {
    return prisma.invitation.update({
      where: {
        id,
      },
      data: {
        acceptedAt: new Date(),
      },
    });
  }

  static async findPendingByOrganization(organizationId: string) {
    return prisma.invitation.findMany({
      where: {
        organizationId,
        acceptedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
