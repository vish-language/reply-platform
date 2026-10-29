import { SubscriptionService } from "../services/subscription.service.js";
export class SubscriptionController {
    static async current(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const subscription = await SubscriptionService.getCurrentSubscription(organizationId);
            return res.json({
                success: true,
                data: subscription,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }
    }
    static async getPlans(req, res) {
        const plans = await SubscriptionService.getPlans();
        return res.status(200).json({
            success: true,
            data: plans,
        });
    }
    static async upgradePlan(req, res) {
        try {
            const { planId } = req.body;
            const organizationId = req.user.organizationId;
            const subscription = await SubscriptionService.upgradePlan(organizationId, planId);
            return res.status(200).json({
                success: true,
                message: "Plan upgraded successfully",
                data: subscription,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to upgrade plan",
            });
        }
    }
    static async cancel(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const subscription = await SubscriptionService.cancelSubscription(organizationId);
            return res.status(200).json({
                success: true,
                message: "Subscription cancelled successfully",
                data: subscription,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Failed to cancel subscription",
            });
        }
    }
    static async reactivate(req, res) {
        try {
            const organizationId = req.user.organizationId;
            const subscription = await SubscriptionService.reactivateSubscription(organizationId);
            return res.status(200).json({
                success: true,
                message: "Subscription reactivated successfully",
                data: subscription,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Failed to reactivate subscription",
            });
        }
    }
}
//# sourceMappingURL=subscription.controller.js.map