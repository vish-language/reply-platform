import { ApiError } from "../../../common/errors/ApiError.js";
import { prisma } from "../../../database/prisma.js";
import { OrganizationRepository } from "../repositories/organization.repository.js";

type updateOrganizationData = {
  name: string;
  isActive: boolean;
};

export class OrganizationService {
  static async getCurrentOrganization(userId: string) {
    const membership =
      await OrganizationRepository.findCurrentOrganization(userId);
    if (!membership) {
      throw new ApiError(404, "No  organization found for the user");
    }
    return {
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      isActive: membership.organization.isActive,
      role: membership.role,
    };
  }

  static async updateCurrentOrganization(
    organizationId: string,
    data: updateOrganizationData,
  ) {
    const organization = await OrganizationRepository.updateOrganization(
      organizationId,
      data,
    );

    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      isActive: organization.isActive,
    };
  }
}
