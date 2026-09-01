import { prisma } from "../../../database/prisma.js";
import type { MembershipRole, MembershipStatus } from "@prisma/client";

export class MemberRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async findMembership(userId: string, organizationId: string) {
    return prisma.membership.findFirst({
      where: {
        userId,
        organizationId,
      },
    });
  }

  static async createMembership(data: {
    userId: string;
    organizationId: string;
    role: MembershipRole;
    status: MembershipStatus;
  }) {
    return prisma.membership.create({
      data,
    });
  }

  static async findMembersByOrganization(organizationId: string) {
    return prisma.membership.findMany({
      where: {
        organizationId,
      },
      include: {
        user: true,
      },
    });
  }

  static async findMembershipById(
    membershipId: string,
    organizationId: string,
  ) {
    return prisma.membership.findFirst({
      where: {
        id: membershipId,
        organizationId,
      },
    });
  }

  static async updateMembership(
    membershipId: string,
    data: {
      role: MembershipRole;
    },
  ) {
    return prisma.membership.update({
      where: {
        id: membershipId,
      },
      data,
    });
  }
  static async deleteMembership(membershipId: string) {
    return prisma.membership.delete({
      where: {
        id: membershipId,
      },
    });
  }
  static async findOrganizationById(organizationId: string) {
    return prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
