import { prisma } from "../../../database/prisma.js";
export class MemberRepository {
    static async findUserByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    static async findMembership(userId, organizationId) {
        return prisma.membership.findFirst({
            where: {
                userId,
                organizationId,
            },
        });
    }
    static async createMembership(data) {
        return prisma.membership.create({
            data,
        });
    }
    static async findMembersByOrganization(organizationId) {
        return prisma.membership.findMany({
            where: {
                organizationId,
            },
            include: {
                user: true,
            },
        });
    }
    static async findMembershipById(membershipId, organizationId) {
        return prisma.membership.findFirst({
            where: {
                id: membershipId,
                organizationId,
            },
        });
    }
    static async updateMembership(membershipId, data) {
        return prisma.membership.update({
            where: {
                id: membershipId,
            },
            data,
        });
    }
    static async deleteMembership(membershipId) {
        return prisma.membership.delete({
            where: {
                id: membershipId,
            },
        });
    }
    static async findOrganizationById(organizationId) {
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
//# sourceMappingURL=member.repository.js.map