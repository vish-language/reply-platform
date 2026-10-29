import { ApiError } from "../errors/ApiError.js";
export function requireRole(allowedRoles) {
    return (req, res, next) => {
        try {
            const membership = req.membership;
            if (!membership) {
                throw new ApiError(403, "Organization membership required");
            }
            if (!allowedRoles.includes(membership.role)) {
                throw new ApiError(403, "Insufficient permissions");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=permission.js.map