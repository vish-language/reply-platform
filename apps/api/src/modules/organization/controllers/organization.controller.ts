import { OrganizationService } from "../services/organization.service.js";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../common/utils/ApiResponse.js";

export class OrganizationController {
  static async current(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrganizationService.getCurrentOrganization(
        req.user.userId,
      );

      return ApiResponse.success(
        res,
        result,
        "Organization fetched successfully",
        200,
      );
    } catch (error) {
      next(error);
    }

    const result = await OrganizationService.updateCurrentOrganization(
      req.user.userId,
      req.body,
    );

    return ApiResponse.success(
      res,
      result,
      "Organization updated successfully",
    );
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrganizationService.getCurrentOrganization(
      req.user.userId,
      );
      return ApiResponse.success(
        res,
        result,
        "Organization fetched successfully",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}
