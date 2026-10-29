import { MembershipStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";
export class OrganizationRepository {
    static async findCurrentOrganization(userId) {
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
    static async findOrganizationById(organizationId) {
        return prisma.organization.findUnique({
            where: {
                id: organizationId,
            },
        });
    }
    static async findActiveMembership(userId) {
        return prisma.membership.findFirst({
            where: {
                userId,
                status: MembershipStatus.ACTIVE,
            },
        });
    }
    static async updateOrganization(organizationId, data) {
        return prisma.organization.update({
            where: {
                id: organizationId,
            },
            data,
        });
    }
}
//# sourceMappingURL=organization.repository.js.map