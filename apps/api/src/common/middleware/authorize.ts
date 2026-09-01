import { Request, Response, NextFunction } from "express";
import { MembershipRole } from "@prisma/client";
import { ApiError } from "../errors/ApiError.js";

export function authorize(requiredRole: MembershipRole) {
  return async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
      next(error);
    }
  };
}
