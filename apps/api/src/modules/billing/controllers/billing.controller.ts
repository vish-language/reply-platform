import { Request, Response } from "express";
import { WebhookEventRepository } from "../repositories/webhook-event.repository.js";
import { BillingService } from "../services/billing.service.js";
import { RazorpayService } from "../services/razorpay.service.js";

export class BillingController {
  static async createOrder(req: Request, res: Response) {
    try {
      const { planId } = req.body;

      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Organization missing",
        });
      }

      console.log("Plan Id", planId);
      console.log("organization Id", organizationId);

      const razorpayOrder = await BillingService.createOrder(
        organizationId,
        planId,
      );

      return res.status(200).json({
        success: true,
        message: "Billing order created successfully",
        data: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      });
    } catch (error) {
      console.error("BILLING ERROR:", error);

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create billing subscription",
      });
    }
  }

  static async verifyPayment(req: Request, res: Response) {
    try {
      console.log("RAW VERIFY BODY:", req.body);

      const { planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
        req.body;

      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Organization missing",
        });
      }

      if (
        !planId ||
        !razorpayPaymentId ||
        !razorpayOrderId ||
        !razorpaySignature
      ) {
        return res.status(400).json({
          success: false,
          message: "Payment details missing",
        });
      }

      const result = await BillingService.verifyPayment(
        organizationId,
        planId,
        {
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: result,
      });
    } catch (error) {
      console.error("VERIFY PAYMENT ERROR:", error);

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment verification failed",
      });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const eventId = req.headers["x-razorpay-event-id"] as string;
      const event = req.body?.event;

      console.log("========== WEBHOOK RECEIVED ==========");
      console.log("EVENT:", event);
      console.log("EVENT ID:", eventId);
      console.log("SIGNATURE:", signature);
      console.log("======================================");

      // 1. Validate required webhook data

      if (!signature) {
        return res.status(400).json({
          success: false,
          message: "Webhook signature missing",
        });
      }

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Webhook event ID missing",
        });
      }

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Webhook event missing",
        });
      }

      if (!req.rawBody) {
        return res.status(400).json({
          success: false,
          message: "Webhook raw body missing",
        });
      }

      // 2. Verify Razorpay webhook signature FIRST

      const isValid = RazorpayService.verifyWebhookSignature(
        req.rawBody.toString("utf8"),
        signature,
      );

      if (!isValid) {
        console.log("INVALID RAZORPAY WEBHOOK");

        return res.status(400).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }

      console.log("VALID RAZORPAY WEBHOOK");

      // 3. Check whether this webhook was already processed

      const existingEvent = await WebhookEventRepository.findByEventId(eventId);

      if (existingEvent) {
        console.log("DUPLICATE WEBHOOK IGNORED:", eventId);

        return res.status(200).json({
          success: true,
          message: "Webhook already processed",
        });
      }

      // 4. Process payment BEFORE marking webhook as processed

      if (event === "payment.captured") {
        const payment = req.body?.payload?.payment?.entity;

        if (!payment) {
          return res.status(400).json({
            success: false,
            message: "Payment data missing from webhook",
          });
        }

        console.log("CAPTURED PAYMENT:", payment.id);

        await BillingService.handlePaymentCapturedWebhook(payment);

        console.log("PAYMENT SAVED FROM WEBHOOK");
      }

      if (event === "payment.failed") {
        const payment = req.body?.payload?.payment?.entity;

        if (!payment) {
          return res.status(400).json({
            success: false,
            message: "Payment data missing from webhook",
          });
        }

        console.log("FAILED PAYMENT:", payment.id);

        await BillingService.handlePaymentFailedWebhook(payment);

        console.log("FAILED PAYMENT SAVED FROM WEBHOOK");
      }

      // 5. Save webhook event ONLY after successful processing

      await WebhookEventRepository.create({
        eventId,
        event,
      });

      console.log("WEBHOOK EVENT SAVED:", eventId);

      // 6. Return success

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("WEBHOOK ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  }

  static async getPaymentHistory(req: Request, res: Response) {
    try {
      const organizationId = req.user?.organizationId;

      if (!organizationId) {
        return res.status(401).json({
          success: false,
          message: "Organization missing",
        });
      }

      const payments = await BillingService.getPaymentHistory(organizationId);

      return res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      console.error("PAYMENT HISTORY ERROR:", error);

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch payment history",
      });
    }
  }
}
