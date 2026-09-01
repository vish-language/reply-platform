import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "./auth.api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await login({
        email,

        password,
      });

      console.log("LOGIN RESPONSE:", response);

      const token = response.data.accessToken;

      const user = response.data.user;

      loginUser(token, user);

      const selectedPlan = localStorage.getItem("selectedPlan");

      if (selectedPlan) {
        localStorage.removeItem("selectedPlan");

        navigate("/billing");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      "
    >
      <form
        onSubmit={submit}
        className="
        space-y-4
        w-96
        "
      >
        <input
          className="
          border
          p-2
          w-full
          "
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="
          border
          p-2
          w-full
          "
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="
          bg-black
          text-white
          w-full
          p-2
          "
        >
          Login
        </button>
      </form>
    </div>
  );
}
