import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError.js";
import { OrganizationRepository } from "../../modules/organization/repositories/organization.repository.js";

export async function requireMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const membership =
      await OrganizationRepository.findActiveMembership(
        req.user.userId
      );

    if (!membership) {
      throw new ApiError(403, "Access Denied");
    }

    req.membership = membership;

    next();
  } catch (error) {
    next(error);
  }
}