import { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  cancelSubscription,
  reactivateSubscription,
} from "../api/subscription.api";
import { Link } from "react-router-dom";

export default function Billing() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await getCurrentSubscription();

        setSubscription(response.data);
      } catch (err) {
        console.error(err);

        setError("Unable to load subscription");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleCancelSubscription() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription? You will keep access until the end of your current billing period.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      await cancelSubscription();

      const response = await getCurrentSubscription();

      setSubscription(response.data);
    } catch (err) {
      console.error("CANCEL SUBSCRIPTION ERROR:", err);

      setError("Unable to cancel subscription");
    } finally {
      setCancelling(false);
    }
  }
  async function handleReactivateSubscription() {
    try {
      setCancelling(true);
      setError("");

      await reactivateSubscription();

      const response = await getCurrentSubscription();

      setSubscription(response.data);
    } catch (err) {
      console.error("REACTIVATE SUBSCRIPTION ERROR:", err);

      setError("Unable to reactivate subscription");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return <div>Loading billing...</div>;
  }

  if (error && !subscription) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!subscription) {
    return null;
  }

  const reviewsUsed = subscription.usage?.reviewsProcessed ?? 0;

  const repliesUsed = subscription.usage?.aiRepliesGenerated ?? 0;

  const reviewPercentage =
    subscription.plan.maxReviews > 0
      ? Math.min((reviewsUsed / subscription.plan.maxReviews) * 100, 100)
      : 0;

  const replyPercentage =
    subscription.plan.maxReplies > 0
      ? Math.min((repliesUsed / subscription.plan.maxReplies) * 100, 100)
      : 0;

  return (
    <div>
      <h1
        className="
        text-3xl
        font-bold
        "
      >
        Billing
      </h1>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        Manage your subscription and usage
      </p>

      {error && (
        <div
          className="
          mt-4
          rounded-lg
          border
          border-red-200
          bg-red-50
          p-4
          text-red-600
          "
        >
          {error}
        </div>
      )}

      <div
        className="
        mt-8
        grid
        md:grid-cols-2
        gap-6
        "
      >
        {/* CURRENT PLAN */}

        <div
          className="
          bg-white
          border
          rounded-xl
          p-6
          "
        >
          <p
            className="
            text-gray-500
            "
          >
            Current Plan
          </p>

          <h2
            className="
            text-4xl
            font-bold
            mt-3
            "
          >
            {subscription.plan.name}
          </h2>

          <div
            className="
            mt-5
            "
          >
            <p>
              Status:
              <span
                className="
                ml-2
                font-semibold
                "
              >
                {subscription.status}
              </span>
            </p>

            <p
              className="
              mt-2
              "
            >
              Monthly Reviews:
              <span
                className="
                ml-2
                font-semibold
                "
              >
                {subscription.plan.maxReviews}
              </span>
            </p>

            <p
              className="
              mt-2
              "
            >
              AI Replies:
              <span
                className="
                ml-2
                font-semibold
                "
              >
                {subscription.plan.maxReplies}
              </span>
            </p>

            {subscription.endDate && (
              <p
                className="
                mt-2
                "
              >
                Current Period Ends:
                <span
                  className="
                  ml-2
                  font-semibold
                  "
                >
                  {new Date(subscription.endDate).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* USAGE */}

        <div
          className="
          bg-white
          border
          rounded-xl
          p-6
          "
        >
          <p
            className="
            text-gray-500
            "
          >
            Usage
          </p>

          <div
            className="
            mt-5
            "
          >
            <div
              className="
              flex
              justify-between
              "
            >
              <span>Reviews</span>

              <span
                className="
                font-semibold
                "
              >
                {reviewsUsed}/{subscription.plan.maxReviews}
              </span>
            </div>

            <div
              className="
              w-full
              bg-gray-200
              rounded-full
              h-3
              mt-2
              "
            >
              <div
                className="
                bg-black
                h-3
                rounded-full
                "
                style={{
                  width: `${reviewPercentage}%`,
                }}
              />
            </div>

            <div
              className="
              flex
              justify-between
              mt-6
              "
            >
              <span>AI Replies</span>

              <span
                className="
                font-semibold
                "
              >
                {repliesUsed}/{subscription.plan.maxReplies}
              </span>
            </div>

            <div
              className="
              w-full
              bg-gray-200
              rounded-full
              h-3
              mt-2
              "
            >
              <div
                className="
                bg-black
                h-3
                rounded-full
                "
                style={{
                  width: `${replyPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BILLING ACTIONS */}

      <div
        className="
        mt-8
        flex
        flex-wrap
        gap-4
        "
      >
        <Link
          to="/pricing"
          className="
          inline-block
          bg-black
          text-white
          px-6
          py-3
          rounded-lg
          "
        >
          Upgrade Plan
        </Link>

        <Link
          to="/payment-history"
          className="
          inline-block
          border
          border-black
          text-black
          px-6
          py-3
          rounded-lg
          "
        >
          Payment History
        </Link>

        {subscription.status === "ACTIVE" &&
          !subscription.cancelAtPeriodEnd && (
            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="
              inline-block
              border
              border-red-500
              text-red-500
              px-6
              py-3
              rounded-lg
              disabled:opacity-50
              disabled:cursor-not-allowed
              "
            >
              {cancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>
          )}
      </div>

      {/* CANCELLATION NOTICE */}

      {subscription.cancelAtPeriodEnd && (
        <div
          className="
    mt-6
    rounded-lg
    border
    border-yellow-300
    bg-yellow-50
    p-4
    text-sm
    text-yellow-800
    "
        >
          <p className="font-semibold">Cancellation scheduled</p>

          <p className="mt-1">
            Your subscription will remain active until{" "}
            {subscription.endDate
              ? new Date(subscription.endDate).toLocaleDateString()
              : "the end of your billing period"}
            .
          </p>

          <button
            onClick={handleReactivateSubscription}
            disabled={cancelling}
            className="
      mt-4
      rounded-lg
      bg-black
      px-4
      py-2
      text-white
      disabled:cursor-not-allowed
      disabled:opacity-50
      "
          >
            {cancelling ? "Updating..." : "Keep Subscription"}
          </button>
        </div>
      )}
    </div>
  );
}
