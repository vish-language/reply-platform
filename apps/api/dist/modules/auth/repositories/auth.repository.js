import { prisma } from "../../../database/prisma.js";
export class AuthRepository {
    static async findByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    static async findById(id) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    static async createUser(db, data) {
        return db.user.create({
            data,
        });
    }
    static async createOrganization(db, data) {
        return db.organization.create({
            data,
        });
    }
    static async createMembership(db, data) {
        return db.membership.create({
            data,
        });
    }
    static async createAISettings(db, organizationId) {
        return db.aISettings.create({
            data: {
                organizationId,
            },
        });
    }
}
//# sourceMappingURL=auth.repository.js.map