import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../pages/Dashboard";
import Reviews from "../pages/Reviews";
import Pricing from "../pages/Pricing";
import GoogleReviews from "../pages/Settings/GoogleReviews";
import Billing from "../pages/Billing";
import NotFound from "../pages/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import AISettings from "../pages/Settings/AISettings";
import Checkout from "../pages/Checkout";
import PaymentHistory from "../pages/PaymentHistory";
import Team from "../pages/Team";
import AcceptInvitation from "../pages/AcceptInvitation";

export const router = createBrowserRouter([
  // PUBLIC ROUTES

  {
    path: "/",

    element: <Home />,
  },

  {
    path: "/login",

    element: <Login />,
  },

  {
    path: "/register",

    element: <Register />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/accept-invitation",
    element: <AcceptInvitation />,
  },

  // PRIVATE ROUTES
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/reviews",
        element: <Reviews />,
      },

      {
        path: "/google-reviews",
        element: <GoogleReviews />,
      },

      {
        path: "/settings/ai",
        element: <AISettings />,
      },
      {
        path: "/billing",
        element: <Billing />,
      },
      {
        path: "/payment-history",
        element: <PaymentHistory />,
      },
      {
        path: "/team",
        element: <Team />,
      },
    ],
  },
  {
    path: "*",

    element: <NotFound />,
  },
]);
