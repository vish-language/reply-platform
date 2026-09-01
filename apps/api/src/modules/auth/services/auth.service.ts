import { ApiError } from "../../../common/errors/ApiError.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import {
  comparePassword,
  hashPassword,
} from "../../../common/utils/password.js";
import { generateSlug } from "../../../common/utils/slug.js";
import { MembershipRole, MembershipStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";
import { generateAccessToken } from "../../../common/utils/jwt.js";
import { InvitationRepository } from "../../member/repositories/invitation.repository.js";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  organizationName: string;
};

type LoginData = {
  email: string;
  password: string;
};

export class AuthService {
  static async register(data: RegisterData) {
    const existingUser = await AuthRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const organizationSlug = generateSlug(data.organizationName);

    const result = await prisma.$transaction(async (tx) => {
      const user = await AuthRepository.createUser(tx, {
        name: data.name,
        email: data.email,
        passwordHash,
      });

      const organization = await AuthRepository.createOrganization(tx, {
        name: data.organizationName,
        slug: organizationSlug,
      });

      await AuthRepository.createAISettings(tx, organization.id);

      await AuthRepository.createMembership(tx, {
        userId: user.id,
        organizationId: organization.id,
        role: MembershipRole.OWNER,
        status: MembershipStatus.ACTIVE,
      });
      const freePlan = await tx.plan.findUnique({
        where: {
          name: "FREE",
        },
      });

      if (!freePlan) {
        throw new ApiError(500, "FREE plan is not configured");
      }
      console.log("FREE PLAN:", freePlan);

      // Create subscription

      const subscription = await tx.subscription.create({
        data: {
          organizationId: organization.id,

          planId: freePlan.id,

          status: "TRIAL",
        },
      });

      console.log("CREATED SUBSCRIPTION:", subscription);

      // Create monthly usage

      const month = new Date().toISOString().slice(0, 7);

      const usage = await tx.usage.create({
        data: {
          organizationId: organization.id,

          month,

          reviewsProcessed: 0,

          aiRepliesGenerated: 0,
        },
      });

      console.log("CREATED USAGE:", usage);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    });

    return result;
  }
  static async login(data: LoginData) {
    const user = await AuthRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    const membership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
    });

    if (!membership) {
      throw new ApiError(403, "No active organization found");
    }
    const accessToken = generateAccessToken({
      userId: user.id,
      organizationId: membership.organizationId,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  static async me(userId: string) {
    const user = await AuthRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
  static async acceptInvitation(data: {
    token: string;
    name: string;
    password: string;
  }) {
    // --------------------------------------------------
    // FIND INVITATION
    // --------------------------------------------------

    const invitation = await InvitationRepository.findByToken(data.token);

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    // --------------------------------------------------
    // CHECK IF ALREADY ACCEPTED
    // --------------------------------------------------

    if (invitation.acceptedAt) {
      throw new ApiError(400, "Invitation has already been accepted");
    }

    // --------------------------------------------------
    // CHECK EXPIRATION
    // --------------------------------------------------

    if (invitation.expiresAt < new Date()) {
      throw new ApiError(400, "Invitation has expired");
    }

    // --------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------

    const existingUser = await AuthRepository.findByEmail(invitation.email);

    // --------------------------------------------------
    // ACCEPT INVITATION IN TRANSACTION
    // --------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      let user = existingUser;

      // ----------------------------------------------
      // CREATE USER IF THEY DON'T EXIST
      // ----------------------------------------------

      if (!user) {
        const passwordHash = await hashPassword(data.password);

        user = await AuthRepository.createUser(tx, {
          name: invitation.name,
          email: invitation.email,
          passwordHash,
        });
      }

      // ----------------------------------------------
      // CHECK EXISTING MEMBERSHIP
      // ----------------------------------------------

      const existingMembership = await tx.membership.findFirst({
        where: {
          userId: user.id,
          organizationId: invitation.organizationId,
        },
      });

      if (existingMembership) {
        throw new ApiError(409, "User already belongs to this organization");
      }

      // ----------------------------------------------
      // CREATE MEMBERSHIP
      // ----------------------------------------------

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: invitation.organizationId,
          role: invitation.role,
          status: MembershipStatus.ACTIVE,
        },
      });

      // ----------------------------------------------
      // MARK INVITATION ACCEPTED
      // ----------------------------------------------

      await tx.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          acceptedAt: new Date(),
        },
      });

      return {
        user,
        membership,
      };
    });

    // --------------------------------------------------
    // GENERATE ACCESS TOKEN
    // --------------------------------------------------

    const accessToken = generateAccessToken({
      userId: result.user.id,
      organizationId: result.membership.organizationId,
    });

    // --------------------------------------------------
    // RETURN AUTH RESULT
    // --------------------------------------------------

    return {
      accessToken,

      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },

      membership: {
        id: result.membership.id,
        organizationId: result.membership.organizationId,
        role: result.membership.role,
        status: result.membership.status,
      },
    };
  }
}
