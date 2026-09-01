import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../../../common/utils/ApiResponse.js";
import { CommentService } from "../services/comment.service.js";

export class CommentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommentService.create(
        req.membership.organizationId,
        req.body,
      );

      return ApiResponse.success(
        res,
        result,
        "Comment created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommentService.findAll(
        req.membership.organizationId,
      );

      return ApiResponse.success(
        res,
        result,
        "Comments fetched successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  static async findById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const comment = await CommentService.findById(String(id));

      return res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const organizationId = req.user.organizationId;

      const result = await CommentService.findPaginated(
        organizationId,
        req.query,
      );

      return res.json({
        success: true,

        message: "Comments fetched successfully",

        data: result.comments,

        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        message: "Failed to fetch comments",
      });
    }
  }
}
