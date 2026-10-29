import { ApiError } from "../../../common/errors/ApiError.js";
import { OrganizationRepository } from "../repositories/organization.repository.js";
export class OrganizationService {
    static async getCurrentOrganization(userId) {
        const membership = await OrganizationRepository.findCurrentOrganization(userId);
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
    static async updateCurrentOrganization(organizationId, data) {
        const organization = await OrganizationRepository.updateOrganization(organizationId, data);
        return {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            isActive: organization.isActive,
        };
    }
}
//# sourceMappingURL=organization.service.js.map