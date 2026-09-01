import { MembershipStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

type updateOrganizationData = {
  name: string;
  isActive: boolean;
};  

export class OrganizationRepository {
  static async findCurrentOrganization(userId: string) {
    return prisma.membership.findFirst({
      where: {
        userId,
        status: MembershipStatus.ACTIVE,
      },
      include: {
        organization: true,
      },
    });
  }
  static async findOrganizationById(organizationId: string) {
    return prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });
  }
  static async findActiveMembership(userId: string) {
    return prisma.membership.findFirst({
      where: {
        userId,
        status: MembershipStatus.ACTIVE,
      },
    });
  }

  static async updateOrganization(
    organizationId: string,
    data: updateOrganizationData,
  ) {
    return prisma.organization.update({
      where: {
        id: organizationId,
      },
      data,
    });
  }
}
