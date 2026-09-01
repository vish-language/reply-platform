import { Request, Response, NextFunction } from "express";

import { ApiResponse } from "../../../common/utils/ApiResponse.js";

import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);

      return ApiResponse.success(
        res,
        result,
        "User registered successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);

      return ApiResponse.success(
        res,
        result,
        "User logged in successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  static async acceptInvitation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await AuthService.acceptInvitation(req.body);

      return ApiResponse.success(
        res,
        result,
        "Invitation accepted successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.me(req.user.userId);

      return ApiResponse.success(res, result, "User fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  }
}
