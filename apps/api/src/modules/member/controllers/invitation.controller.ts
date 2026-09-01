import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ApiResponse } from "../../../common/utils/ApiResponse.js";

import { InvitationService } from "../services/invitation.service.js";

export class InvitationController {
  static async getInvitation(
    req: Request<{ token: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result =
        await InvitationService.getInvitation(
          req.params.token,
        );

      return ApiResponse.success(
        res,
        result,
        "Invitation is valid",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}