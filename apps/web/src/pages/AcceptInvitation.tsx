import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getInvitation, acceptInvitation } from "../api/invitation.api";

import { useAuth } from "../context/AuthContext";

interface Invitation {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  expiresAt: string;
  organization: {
    id: string;
    name: string;
  };
}

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState<Invitation | null>(null);

  const [loading, setLoading] = useState(true);

  const [accepting, setAccepting] = useState(false);

  const [error, setError] = useState("");

  const [name, setName] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadInvitation() {
      if (!token) {
        setError("Invitation token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await getInvitation(token);

        const data = response.data;

        setInvitation(data);

        setName(data.name);
      } catch (error: any) {
        console.error("INVITATION LOAD ERROR:", error);

        setError(
          error?.response?.data?.message ||
            "This invitation is invalid or has expired.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvitation();
  }, [token]);

  async function handleAccept(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Invitation token is missing");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setAccepting(true);

      const response = await acceptInvitation({
        token,
        name: name.trim(),
        password,
      });

      const result = response.data;

      loginUser(result.accessToken, result.user);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("ACCEPT INVITATION ERROR:", error);

      setError(error?.response?.data?.message || "Unable to accept invitation");
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading invitation...</p>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white border rounded-xl p-8">
            <h1 className="text-2xl font-bold">Invalid Invitation</h1>

            <p className="text-red-500 mt-4">{error}</p>

            <button
              onClick={() => navigate("/login")}
              className="
                mt-6
                w-full
                bg-black
                text-white
                py-3
                rounded-lg
              "
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border rounded-xl p-8">
          <h1 className="text-3xl font-bold">Join ReplyAI</h1>

          <p className="text-gray-500 mt-2">You have been invited to join</p>

          <div className="mt-5 bg-gray-50 border rounded-lg p-4">
            <p className="font-semibold">{invitation.organization.name}</p>

            <p className="text-sm text-gray-500 mt-1">
              Role: {invitation.role}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Email: {invitation.email}
            </p>
          </div>

          <form onSubmit={handleAccept} className="mt-6 space-y-4">
            {/* NAME */}

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                "
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>

              <input
                type="email"
                value={invitation.email}
                disabled
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  bg-gray-100
                  text-gray-500
                "
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                "
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                "
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={accepting}
              className="
                w-full
                bg-black
                text-white
                py-3
                rounded-lg
                disabled:opacity-50
              "
            >
              {accepting ? "Joining..." : "Accept Invitation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
