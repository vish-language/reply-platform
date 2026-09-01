import { prisma } from "../../../database/prisma.js";

export class GoogleReviewRepository {
  static async upsert(organizationId: string, data: any) {
    return prisma.googleIntegration.upsert({
      where: {
        organizationId,
      },

      update: {
        locationId: data.locationId,
        accountEmail: data.accountEmail,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        webhookSecret: data.webhookSecret,
        isActive: true,
      },

      create: {
        organizationId,
        locationId: data.locationId,
        accountEmail: data.accountEmail,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        webhookSecret: data.webhookSecret,
      },
    });
  }

  static async findByOrganization(organizationId: string) {
    return prisma.googleIntegration.findUnique({
      where: {
        organizationId,
      },
    });
  }

  static async findByLocationId(locationId: string) {
    return prisma.googleIntegration.findFirst({
      where: {
        locationId,
        isActive: true,
      },
    });
  }

  static async disconnect(organizationId: string) {
    return prisma.googleIntegration.update({
      where: {
        organizationId,
      },
      data: {
        isActive: false,
      },
    });
  }
}
