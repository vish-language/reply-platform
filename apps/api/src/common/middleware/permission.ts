import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type {
  MembershipRole,
} from "@prisma/client";

import { ApiError } from "../errors/ApiError.js";


export function requireRole(
  allowedRoles: MembershipRole[],
) {

  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {

    try {

      const membership =
        req.membership;


      if (!membership) {
        throw new ApiError(
          403,
          "Organization membership required",
        );
      }


      if (
        !allowedRoles.includes(
          membership.role,
        )
      ) {

        throw new ApiError(
          403,
          "Insufficient permissions",
        );

      }


      next();


    } catch(error){

      next(error);

    }

  };

}