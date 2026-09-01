import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { createOrder } from "../api/billing.api";
import { openRazorpayCheckout } from "../services/razorpay.service";

export default function Checkout() {
  const navigate = useNavigate();

  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;

    async function startCheckout() {
      const planId = localStorage.getItem("selectedPlan");

      console.log("SELECTED PLAN:", planId);

      if (!planId) {
        navigate("/pricing");

        return;
      }

      try {
        const response = await createOrder(planId);

        console.log("ORDER RESPONSE:", response.data);

        openRazorpayCheckout({
          keyId: response.data.keyId,

          orderId: response.data.orderId,

          planId,
          navigate,
        });
      } catch (error) {
        console.log("CHECKOUT ERROR:", error);
      }
    }

    startCheckout();
  }, []);

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      "
    >
      <h1>Preparing checkout...</h1>
    </div>
  );
}
