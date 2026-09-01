import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPlans } from "../api/plans.api";

import { useAuth } from "../context/AuthContext";

export default function Pricing() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [plans, setPlans] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await getPlans();

        console.log("PLANS:", response);

        setPlans(response.data);
      } catch (error) {
        console.error("PLAN LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleUpgrade(planId: string) {
    // save selected plan

    localStorage.setItem("selectedPlan", planId);

    // Existing user

    if (user) {
      navigate("/checkout");

      return;
    }

    // New user

    navigate("/register");
  }

  if (loading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div>
      <h1
        className="
        text-4xl
        font-bold
        "
      >
        Choose Your Plan
      </h1>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        Scale your AI review management
      </p>

      <div
        className="
        grid
        md:grid-cols-3
        gap-6
        mt-10
        "
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="
              bg-white
              border
              rounded-xl
              p-6
              "
          >
            <h2
              className="
                text-2xl
                font-bold
                "
            >
              {plan.name}
            </h2>

            <p
              className="
                text-4xl
                font-bold
                mt-4
                "
            >
              ${plan.price}
              <span
                className="
                  text-sm
                  text-gray-500
                  "
              >
                /month
              </span>
            </p>

            <div
              className="
                mt-6
                space-y-3
                "
            >
              <p>
                Reviews:
                <b className="ml-2">{plan.maxReviews}</b>
              </p>

              <p>
                AI Replies:
                <b className="ml-2">{plan.maxReplies}</b>
              </p>
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.price === 0}
              className="
                mt-8
                w-full
                bg-black
                text-white
                py-3
                rounded-lg
                disabled:opacity-50
                "
            >
              {plan.price === 0 ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
