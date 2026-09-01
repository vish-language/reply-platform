import crypto from "crypto";

import { MembershipStatus, MembershipRole } from "@prisma/client";

import { ApiError } from "../../../common/errors/ApiError.js";
import { EmailService } from "../../../common/services/email.service.js";

import { MemberRepository } from "../repositories/member.repository.js";
import { InvitationRepository } from "../repositories/invitation.repository.js";

type AddMemberData = {
  name: string;
  email: string;
  role: MembershipRole;
};

type UpdateMemberData = {
  role: MembershipRole;
};

export class MemberService {
  // ==================================================
  // ADD MEMBER / CREATE INVITATION
  // ==================================================

  static async addMember(organizationId: string, data: AddMemberData) {
    const email = data.email.trim().toLowerCase();

    const name = data.name.trim();

    // --------------------------------------------------
    // VALIDATE INPUT
    // --------------------------------------------------

    if (!name) {
      throw new ApiError(400, "Member name is required");
    }

    if (!email) {
      throw new ApiError(400, "Member email is required");
    }

    // --------------------------------------------------
    // CHECK IF USER ALREADY EXISTS
    // --------------------------------------------------

    const user = await MemberRepository.findUserByEmail(email);

    // ==================================================
    // USER DOES NOT EXIST
    // CREATE INVITATION
    // ==================================================

    if (!user) {
      console.log("USER NOT FOUND - CREATING INVITATION:", email);

      // ------------------------------------------------
      // CHECK EXISTING PENDING INVITATION
      // ------------------------------------------------

      const existingInvitation = await InvitationRepository.findPendingByEmail(
        organizationId,
        email,
      );

      if (existingInvitation) {
        throw new ApiError(
          409,
          "A pending invitation already exists for this email",
        );
      }

      // ------------------------------------------------
      // GET ORGANIZATION
      // ------------------------------------------------

      const organization =
        await MemberRepository.findOrganizationById(organizationId);

      if (!organization) {
        throw new ApiError(404, "Organization not found");
      }

      // ------------------------------------------------
      // GENERATE SECURE INVITATION TOKEN
      // ------------------------------------------------

      const token = crypto.randomBytes(32).toString("hex");

      // ------------------------------------------------
      // INVITATION EXPIRES IN 7 DAYS
      // ------------------------------------------------

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // ------------------------------------------------
      // CREATE INVITATION
      // ------------------------------------------------

      const invitation = await InvitationRepository.create({
        organizationId,
        email,
        name,
        role: data.role as "ADMIN" | "MEMBER",
        token,
        expiresAt,
      });

      console.log("INVITATION CREATED:", invitation.id);

      // ------------------------------------------------
      // SEND INVITATION EMAIL
      // ------------------------------------------------

      await EmailService.sendInvitationEmail({
        email,
        name,
        organizationName: organization.name,
        token,
      });

      console.log("INVITATION EMAIL SENT:", email);

      // ------------------------------------------------
      // RETURN SAFE RESPONSE
      // ------------------------------------------------

      return {
        type: "INVITATION",
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        status: "PENDING",
        expiresAt: invitation.expiresAt,
      };
    }

    // ==================================================
    // USER EXISTS
    // CREATE ACTIVE MEMBERSHIP
    // ==================================================

    console.log("USER FOUND - CREATING MEMBERSHIP:", user.email);

    // --------------------------------------------------
    // CHECK EXISTING MEMBERSHIP
    // --------------------------------------------------

    const existingMembership = await MemberRepository.findMembership(
      user.id,
      organizationId,
    );

    if (existingMembership) {
      throw new ApiError(409, "User already belongs to this organization");
    }

    // --------------------------------------------------
    // CREATE MEMBERSHIP
    // --------------------------------------------------

    const membership = await MemberRepository.createMembership({
      userId: user.id,
      organizationId,
      role: data.role,
      status: MembershipStatus.ACTIVE,
    });

    console.log("MEMBERSHIP CREATED:", membership.id);

    return {
      type: "MEMBERSHIP",
      id: membership.id,
      userId: membership.userId,
      organizationId: membership.organizationId,
      name: user.name,
      email: user.email,
      role: membership.role,
      status: membership.status,
    };
  }

  // ==================================================
  // LIST MEMBERS
  // ==================================================

  static async listMembers(organizationId: string) {
    const memberships =
      await MemberRepository.findMembersByOrganization(organizationId);

    return memberships.map((membership) => ({
      id: membership.id,
      userId: membership.userId,
      organizationId: membership.organizationId,
      name: membership.user.name,
      email: membership.user.email,
      role: membership.role,
      status: membership.status,
    }));
  }

  // ==================================================
  // UPDATE MEMBER
  // ==================================================

  static async updateMember(
    organizationId: string,
    membershipId: string,
    data: UpdateMemberData,
  ) {
    const membership = await MemberRepository.findMembershipById(
      membershipId,
      organizationId,
    );

    if (!membership) {
      throw new ApiError(404, "Member not found");
    }

    // --------------------------------------------------
    // OWNER CANNOT BE CHANGED
    // --------------------------------------------------

    if (membership.role === MembershipRole.OWNER) {
      throw new ApiError(403, "Owner role cannot be changed");
    }

    const updatedMembership = await MemberRepository.updateMembership(
      membershipId,
      data,
    );

    return {
      id: updatedMembership.id,
      userId: updatedMembership.userId,
      organizationId: updatedMembership.organizationId,
      role: updatedMembership.role,
      status: updatedMembership.status,
    };
  }

  // ==================================================
  // REMOVE MEMBER
  // ==================================================

  static async removeMember(organizationId: string, membershipId: string) {
    const membership = await MemberRepository.findMembershipById(
      membershipId,
      organizationId,
    );

    if (!membership) {
      throw new ApiError(404, "Member not found");
    }

    // --------------------------------------------------
    // OWNER CANNOT BE REMOVED
    // --------------------------------------------------

    if (membership.role === MembershipRole.OWNER) {
      throw new ApiError(403, "Owner cannot be removed");
    }

    await MemberRepository.deleteMembership(membershipId);
  }
}
