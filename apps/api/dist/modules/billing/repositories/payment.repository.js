import { prisma } from "../../../database/prisma.js";
export class PaymentRepository {
    static async createPayment(data) {
        return prisma.payment.upsert({
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
    static async findByOrganizationId(organizationId) {
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
//# sourceMappingURL=payment.repository.js.map