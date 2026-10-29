import { prisma } from "../../../database/prisma.js";
export class InvitationRepository {
    static async findPendingByEmail(organizationId, email) {
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
    static async create(data) {
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
    static async findByToken(token) {
        return prisma.invitation.findUnique({
            where: {
                token,
            },
            include: {
                organization: true,
            },
        });
    }
    static async markAccepted(id) {
        return prisma.invitation.update({
            where: {
                id,
            },
            data: {
                acceptedAt: new Date(),
            },
        });
    }
    static async findPendingByOrganization(organizationId) {
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
//# sourceMappingURL=invitation.repository.js.map