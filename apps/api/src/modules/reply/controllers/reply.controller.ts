import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../../../common/utils/ApiResponse.js";
import { ReplyService } from "../services/reply.service.js";

export class ReplyController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReplyService.create(
        req.membership.organizationId,
        req.body,
      );

      return ApiResponse.success(
        res,
        result,
        "Reply created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  static async findByComment(req: Request, res: Response, next: NextFunction) {
    try {
      const commentId = req.params.commentId;

      if (Array.isArray(commentId)) {
        throw new Error("Invalid comment ID");
      }

      const result = await ReplyService.findByComment(
        req.membership.organizationId,
        commentId,
      );

      return ApiResponse.success(
        res,
        result,
        "Replies fetched successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
 
}
