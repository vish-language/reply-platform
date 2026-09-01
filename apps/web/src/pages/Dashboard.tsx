import { useEffect, useState } from "react";

import RecentReviews from "../components/dashboard/RecentReviews";

import { getComments } from "../api/comments.api";
import { getCurrentSubscription } from "../api/subscription.api";
import { getAnalytics } from "../api/analytics.api";

import StatCard from "../components/dashboard/StatCard";
import SubscriptionCard from "../components/dashboard/SubscriptionCard";

export default function Dashboard() {
  const [subscription, setSubscription] = useState<any>(null);

  const [reviews, setReviews] = useState<any[]>([]);

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const subscriptionResponse = await getCurrentSubscription();

      setSubscription(subscriptionResponse.data);

      const analyticsResponse = await getAnalytics();

      setAnalytics(analyticsResponse.data);

      const commentsResponse = await getComments();

      setReviews(commentsResponse.data);
    }

    load();
  }, []);

  return (
    <div>
      <h1
        className="
        text-3xl
        font-bold
        "
      >
        Welcome back 👋
      </h1>

      <div
        className="
        grid
        grid-cols-3
        gap-5
        mt-8
        "
      >
        {subscription && (
          <SubscriptionCard
            plan={subscription.plan.name}
            status={subscription.status}
          />
        )}

        <StatCard title="Total Reviews" value={analytics?.totalReviews ?? 0} />

        <StatCard title="AI Replies" value={analytics?.repliedReviews ?? 0} />

        <StatCard title="Reply Rate" value={`${analytics?.replyRate ?? 0}%`} />
      </div>

      <RecentReviews reviews={reviews} />
    </div>
  );
}
