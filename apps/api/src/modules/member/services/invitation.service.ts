import { ApiError } from "../../../common/errors/ApiError.js";

import { InvitationRepository } from "../repositories/invitation.repository.js";

export class InvitationService {
  static async getInvitation(token: string) {
    if (!token) {
      throw new ApiError(400, "Invitation token is required");
    }

    const invitation = await InvitationRepository.findByToken(token);

    if (!invitation) {
      throw new ApiError(404, "Invitation not found");
    }

    if (invitation.acceptedAt) {
      throw new ApiError(400, "Invitation has already been accepted");
    }

    if (invitation.expiresAt < new Date()) {
      throw new ApiError(400, "Invitation has expired");
    }

    return {
      id: invitation.id,
      name: invitation.name,
      email: invitation.email,
      role: invitation.role,
      organization: {
        id: invitation.organization.id,
        name: invitation.organization.name,
      },
      expiresAt: invitation.expiresAt,
    };
  }
}
