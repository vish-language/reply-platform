import { prisma } from "../../../database/prisma.js";

export class SubscriptionRepository {
  static async findByOrganizationId(organizationId: string) {
    return prisma.subscription.findUnique({
      where: {
        organizationId,
      },

      include: {
        plan: true,
      },
    });
  }
  static async getUsage(organizationId: string) {
    const month = new Date().toISOString().slice(0, 7);

    return prisma.usage.findUnique({
      where: {
        organizationId_month: {
          organizationId,
          month,
        },
      },
    });
  }
  static async findAllPlans() {
    return prisma.plan.findMany({
      orderBy: {
        price: "asc",
      },
    });
  }
  static async updatePlan(organizationId: string, planId: string) {
    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    return prisma.subscription.update({
      where: {
        organizationId,
      },
      data: {
        planId,
        status: "ACTIVE",
        startDate,
        endDate,
        cancelAtPeriodEnd: false,
      },
      include: {
        plan: true,
      },
    });
  }
  static async findPlanById(planId: string) {
    return prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });
  }
  static async cancelSubscription(organizationId: string) {
    return prisma.subscription.update({
      where: {
        organizationId,
      },
      data: {
        cancelAtPeriodEnd: true,
      },
      include: {
        plan: true,
      },
    });
  }
  static async expireSubscription(organizationId: string) {
    return prisma.subscription.update({
      where: {
        organizationId,
      },
      data: {
        status: "EXPIRED",
      },
      include: {
        plan: true,
      },
    });
  }
  static async reactivateSubscription(organizationId: string) {
    return prisma.subscription.update({
      where: {
        organizationId,
      },
      data: {
        cancelAtPeriodEnd: false,
      },
      include: {
        plan: true,
      },
    });
  }
}
