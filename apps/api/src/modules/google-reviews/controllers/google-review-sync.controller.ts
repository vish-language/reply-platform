import { Request, Response } from "express";
import { GoogleReviewSyncService } from "../services/google-review-sync.service.js";

export class GoogleReviewSyncController {
  static async sync(req: Request, res: Response) {
    try {
      const { locationId } = req.body;

      const result = await GoogleReviewSyncService.sync(locationId);

      return res.status(200).json({
        success: true,
        message: "Google reviews synced successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to sync reviews",
      });
    }
  }
}
