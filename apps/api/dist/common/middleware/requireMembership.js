import { ApiError } from "../errors/ApiError.js";
import { OrganizationRepository } from "../../modules/organization/repositories/organization.repository.js";
export async function requireMembership(req, res, next) {
    try {
        const membership = await OrganizationRepository.findActiveMembership(req.user.userId);
        if (!membership) {
            throw new ApiError(403, "Access Denied");
        }
        req.membership = membership;
        next();
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=requireMembership.js.map