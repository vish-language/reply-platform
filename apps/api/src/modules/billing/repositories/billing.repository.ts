import { prisma } from "../../../database/prisma.js";

export class BillingRepository {
  static async createOrUpdateBillingAccount(data: {
    organizationId: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySubscriptionId?: string;
    planId?: string;
  }) {
    return prisma.billingAccount.upsert({
      where: {
        organizationId: data.organizationId,
      },

      update: {
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySubscriptionId: data.razorpaySubscriptionId,
        planId: data.planId,
      },

      create: {
        organizationId: data.organizationId,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySubscriptionId: data.razorpaySubscriptionId,
        planId: data.planId,
      },
    });
  }
  static async findByOrderId(razorpayOrderId: string) {
    return prisma.billingAccount.findFirst({
      where: {
        razorpayOrderId,
      },
    });
  }
  
}
