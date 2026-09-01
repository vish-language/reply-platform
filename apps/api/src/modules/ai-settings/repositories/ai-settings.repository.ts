import { prisma } from "../../../database/prisma.js";

export class AISettingsRepository {
  static async findByOrganizationId(
    organizationId: string,
  ) {
    return prisma.aISettings.findUnique({
      where: {
        organizationId,
      },
    });
  }

  static async updateByOrganizationId(
    organizationId: string,
    data: {
      autoReplyEnabled?: boolean;
      tone?: string;
      language?: string;
      instructions?: string | null;
    },
  ) {
    return prisma.aISettings.update({
      where: {
        organizationId,
      },
      data,
    });
  }
}