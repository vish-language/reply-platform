import { prisma } from "../../../database/prisma.js";

export class AISettingsRepository {
  static async findByOrganizationId(organizationId: string) {
    return prisma.aISettings.findUnique({
      where: {
        organizationId,
      },
    });
  }
}
