import { prisma } from "../../../database/prisma.js";
export class AISettingsRepository {
    static async findByOrganizationId(organizationId) {
        return prisma.aISettings.findUnique({
            where: {
                organizationId,
            },
        });
    }
    static async updateByOrganizationId(organizationId, data) {
        return prisma.aISettings.update({
            where: {
                organizationId,
            },
            data,
        });
    }
}
//# sourceMappingURL=ai-settings.repository.js.map