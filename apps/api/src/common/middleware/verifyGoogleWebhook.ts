import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import { GoogleReviewRepository } from "../../modules/google-reviews/repositories/google-review.repository.js";

export async function verifyGoogleWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const locationId = req.body.locationId;

    const integration =
      await GoogleReviewRepository.findByLocationId(locationId);

    if (!integration) {
      return res.status(404).json({
        success: false,
        message: "Google integration not found",
      });
    }

    const signature = req.headers["x-google-signature"];

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: "Missing signature",
      });
    }

    if (!integration.webhookSecret) {
      return res.status(500).json({
        success: false,
        message: "Webhook secret not configured",
      });
    }
    console.log("RAW BODY:");
    console.log(req.rawBody?.toString());

    console.log(req.rawBody?.toString("hex"));

    const expected = crypto
      .createHmac("sha256", integration.webhookSecret)
      .update(req.rawBody!)
      .digest("hex");
    console.log("EXPECTED:", expected);
    console.log("RECEIVED:", signature);

    if (signature !== expected) {
      return res.status(401).json({
        success: false,
        message: "Invalid signature",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
