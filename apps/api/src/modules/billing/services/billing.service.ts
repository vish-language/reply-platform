import { SubscriptionRepository } from "../../subscription/repositories/subscription.repository.js";
import { BillingRepository } from "../repositories/billing.repository.js";
import { RazorpayService } from "./razorpay.service.js";
import { PaymentRepository } from "../repositories/payment.repository.js";
export class BillingService {
  static async createOrder(organizationId: string, planId: string) {
    const plan = await SubscriptionRepository.findPlanById(planId);

    if (!plan) {
      throw new Error("Plan not found");
    }

    console.log("PLAN FROM DATABASE:", plan);

    // Convert rupees to paise
    const amount = Math.round(plan.price * 100);

    console.log("RAZORPAY ORDER AMOUNT:", amount);

    const razorpayOrder = await RazorpayService.createOrder({
      amount,
    });

    await BillingRepository.createOrUpdateBillingAccount({
      organizationId,

      razorpayOrderId: razorpayOrder.id,

      planId: plan.id,
    });

    return razorpayOrder;
  }
  static async verifyPayment(
    organizationId: string,
    planId: string,
    data: {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    },
  ) {
    const isValid = RazorpayService.verifyPayment({
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
    });

    if (!isValid) {
      throw new Error("Invalid payment signature");
    }

    return {
      verified: true,
    };
  }
  static async handlePaymentCapturedWebhook(payment: any) {
    const billingAccount = await BillingRepository.findByOrderId(
      payment.order_id,
    );

    if (!billingAccount) {
      throw new Error("Billing account not found");
    }

    await PaymentRepository.createPayment({
      organizationId: billingAccount.organizationId,

      razorpayPaymentId: payment.id,

      razorpayOrderId: payment.order_id,

      amount: payment.amount,

      currency: payment.currency,

      status: "SUCCESS",
    });

    if (billingAccount.planId) {
      await SubscriptionRepository.updatePlan(
        billingAccount.organizationId,
        billingAccount.planId,
      );
    }
  }
  static async handlePaymentFailedWebhook(payment: any) {
    const billingAccount = await BillingRepository.findByOrderId(
      payment.order_id,
    );

    if (!billingAccount) {
      throw new Error("Billing account not found");
    }

    await PaymentRepository.createPayment({
      organizationId: billingAccount.organizationId,

      razorpayPaymentId: payment.id,

      razorpayOrderId: payment.order_id,

      amount: payment.amount,

      currency: payment.currency,

      status: "FAILED",
    });

    console.log("FAILED PAYMENT STORED:", payment.id);
  }
  static async getPaymentHistory(organizationId: string) {
    return PaymentRepository.findByOrganizationId(organizationId);
  }
}
