import { SubscriptionRepository } from "../repositories/subscription.repository.js";

export class SubscriptionService {
  static async getPlans() {
    return SubscriptionRepository.findAllPlans();
  }
  static async getCurrentSubscription(organizationId: string) {
    return this.checkSubscriptionExpiry(organizationId);
  }
  static async upgradePlan(organizationId: string, planId: string) {
    const plan = await SubscriptionRepository.findPlanById(planId);

    if (!plan) {
      throw new Error("Plan not found");
    }

    const subscription =
      await SubscriptionRepository.findByOrganizationId(organizationId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    return SubscriptionRepository.updatePlan(organizationId, planId);
  }
  static async cancelSubscription(organizationId: string) {
    const subscription =
      await SubscriptionRepository.findByOrganizationId(organizationId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === "CANCELLED") {
      throw new Error("Subscription is already cancelled");
    }

    return SubscriptionRepository.cancelSubscription(organizationId);
  }
  static async checkSubscriptionExpiry(organizationId: string) {
    const subscription =
      await SubscriptionRepository.findByOrganizationId(organizationId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (
      subscription.endDate &&
      subscription.endDate <= new Date() &&
      subscription.status === "ACTIVE"
    ) {
      return SubscriptionRepository.expireSubscription(organizationId);
    }

    return subscription;
  }
  static async reactivateSubscription(organizationId: string) {
    const subscription =
      await SubscriptionRepository.findByOrganizationId(organizationId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status !== "ACTIVE") {
      throw new Error("Only an active subscription can be reactivated");
    }

    if (!("cancelAtPeriodEnd" in subscription) || !subscription.cancelAtPeriodEnd) {
      throw new Error("Subscription is not scheduled for cancellation");
    }

    if (subscription.endDate && subscription.endDate <= new Date()) {
      throw new Error("Subscription period has already ended");
    }

    return SubscriptionRepository.reactivateSubscription(organizationId);
  }
}
