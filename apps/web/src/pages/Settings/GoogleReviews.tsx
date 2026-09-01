import { useEffect, useState } from "react";

import {
  getGoogleConnection,
  connectGoogleReview,
  syncGoogleReviews,
  disconnectGoogleReview,
} from "../../api/google-review.api";

export default function GoogleReviews() {
  const [connected, setConnected] = useState(false);

  const [locationId, setLocationId] = useState("");

  const [accountEmail, setAccountEmail] = useState("");

  const [accessToken, setAccessToken] = useState("");

  const [refreshToken, setRefreshToken] = useState("");

  const [webhookSecret, setWebhookSecret] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConnection();
  }, []);

  async function loadConnection() {
    try {
      const response = await getGoogleConnection();

      console.log("GOOGLE CONNECTION:", response);

      if (response.data) {
        setConnected(true);

        setLocationId(response.data.locationId);
      } else {
        setConnected(false);
      }
    } catch (error) {
      console.error("Google connection load failed", error);

      setConnected(false);
    }
  }

  async function handleConnect() {
    try {
      await connectGoogleReview({
        locationId,

        accountEmail,

        accessToken,

        refreshToken,

        webhookSecret,
      });

      await loadConnection();

      setMessage("Google Reviews connected successfully");
    } catch (error) {
      console.error(error);

      setMessage("Google connection failed");
    }
  }

  async function handleSync() {
    try {
      setLoading(true);

      setMessage("Syncing reviews...");

      const response = await syncGoogleReviews({
        locationId,
      });

      console.log("SYNC RESPONSE:", response);

      setMessage("Reviews synced successfully");
    } catch (error) {
      console.error("SYNC ERROR:", error);

      setMessage("Review sync failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectGoogleReview();

      setConnected(false);

      setLocationId("");

      setMessage("Google Reviews disconnected");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-xl">
      <h1
        className="
        text-3xl
        font-bold
        "
      >
        Google Reviews
      </h1>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        Connect your Google Business reviews
      </p>

      {message && (
        <div
          className="
          mt-5
          bg-gray-100
          rounded-lg
          p-3
          "
        >
          {message}
        </div>
      )}

      {connected ? (
        <div
          className="
          mt-8
          space-y-5
          "
        >
          <div
            className="
            border
            rounded-lg
            p-4
            "
          >
            <h3
              className="
              font-semibold
              "
            >
              Connected ✅
            </h3>

            <p className="mt-2">
              Location:
              <span className="font-semibold ml-2">{locationId}</span>
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={loading}
            className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-lg
            disabled:opacity-50
            "
          >
            {loading ? "Syncing..." : "Sync Reviews"}
          </button>

          <button
            onClick={handleDisconnect}
            className="
            bg-red-600
            text-white
            px-5
            py-3
            rounded-lg
            "
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div
          className="
          mt-8
          space-y-4
          "
        >
          <input
            className="
            border
            rounded-lg
            p-3
            w-full
            "
            placeholder="Location ID"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          />

          <input
            className="
            border
            rounded-lg
            p-3
            w-full
            "
            placeholder="Google Account Email"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
          />

          <input
            className="
            border
            rounded-lg
            p-3
            w-full
            "
            placeholder="Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />

          <input
            className="
            border
            rounded-lg
            p-3
            w-full
            "
            placeholder="Refresh Token"
            value={refreshToken}
            onChange={(e) => setRefreshToken(e.target.value)}
          />

          <input
            className="
            border
            rounded-lg
            p-3
            w-full
            "
            placeholder="Webhook Secret"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
          />

          <button
            onClick={handleConnect}
            className="
            bg-black
            text-white
            px-5
            py-3
            rounded-lg
            "
          >
            Connect Google Reviews
          </button>
        </div>
      )}
    </div>
  );
}
