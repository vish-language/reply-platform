import { prisma } from "../../../database/prisma.js";
import { MembershipRole, MembershipStatus } from "@prisma/client";
import type { DatabaseClient } from "../../../database/types.js";

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
};
type CreateOrganizationData = {
  name: string;
  slug: string;
};
type CreateMembershipData = {
  userId: string;
  organizationId: string;
  role: MembershipRole;
  status: MembershipStatus;
};

export class AuthRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  static async findById(id: string) {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
}
  static async createUser(db: DatabaseClient, data: CreateUserData) {
    return db.user.create({
      data,
    });
  }

  static async createOrganization(
    db: DatabaseClient,
    data: CreateOrganizationData,
  ) {
    return db.organization.create({
      data,
    });
  }

  static async createMembership(
    db: DatabaseClient,
    data: CreateMembershipData,
  ) {
    return db.membership.create({
      data,
    });
  }
  static async createAISettings(
    db: DatabaseClient,
    organizationId: string,
  ) {
    return db.aISettings.create({
      data: {
        organizationId,
      },
    });
  }
}
