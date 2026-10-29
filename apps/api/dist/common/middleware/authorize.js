import { ApiError } from "../errors/ApiError.js";
export function authorize(requiredRole) {
    return async (req, res, next) => {
        try {
            // requireMembership should run before authorize
            const membership = req.membership;
            if (!membership) {
                throw new ApiError(403, "Access Denied");
            }
            if (membership.role !== requiredRole) {
                throw new ApiError(403, "Access Denied");
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=authorize.js.map