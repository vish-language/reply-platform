import { prisma } from "../../../database/prisma.js";

export class PaymentRepository {
  static async createPayment(data: {
    organizationId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
  }) {
    return (prisma as any).payment.upsert({
      where: {
        razorpayPaymentId: data.razorpayPaymentId,
      },

      update: {
        amount: data.amount,
        currency: data.currency,
        status: data.status,
      },

      create: data,
    });
  }
  static async findByOrganizationId(organizationId: string) {
    return prisma.payment.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
