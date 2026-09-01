import { Request, Response, NextFunction } from "express";
import { GoogleReviewService } from "../services/google-review.service.js";

export class GoogleReviewController {
  static async connect(req: Request, res: Response) {
    const organizationId = req.membership!.organizationId;

    const integration = await GoogleReviewService.connect(
      organizationId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Google account connected successfully",
      data: integration,
    });
  }

  static async getConnection(req: Request, res: Response) {
    const organizationId = req.membership!.organizationId;

    const integration = await GoogleReviewService.getConnection(organizationId);

    return res.status(200).json({
      success: true,
      data: integration,
    });
  }

  static async webhook(req: Request, res: Response) {
    console.log("WEBHOOK BODY:", req.body);
    const comment = await GoogleReviewService.processWebhook(req.body);

    if (comment.alreadyProcessed) {
      return res.status(200).json({
        success: true,
        message: "Google review already processed",
        data: comment,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Google review processed successfully",
      data: comment,
    });
  }

  static async disconnect(req: Request, res: Response) {
    const result = await GoogleReviewService.disconnect(
      req.membership.organizationId,
    );

    return res.json({
      success: true,
      message: "Google account disconnected successfully",
      data: result,
    });
  }

  static async testWebhook(req: Request, res: Response, next: NextFunction) {
    {
      try {
        const result = await GoogleReviewService.processWebhook(req.body);

        return res.status(201).json({
          success: true,
          message: "Test webhook processed successfully",
          data: result,
        });
      } catch (error) {
        next(error);
      }
    }
  }
}
