import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../../../common/utils/ApiResponse.js";

import { aiService } from "../services/ai.container.js";

export class AIController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await aiService.generateReply({
        organizationId: req.membership.organizationId,

        comment: req.body.comment,
      });

      return ApiResponse.success(
        res,
        result,
        "AI reply generated successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}
