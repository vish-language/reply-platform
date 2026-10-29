import { prisma } from "../../../database/prisma.js";
export class AISettingsRepository {
    static async findByOrganizationId(organizationId) {
        return prisma.aISettings.findUnique({
            where: {
                organizationId,
            },
        });
    }
}
//# sourceMappingURL=ai-settings.repository.js.map