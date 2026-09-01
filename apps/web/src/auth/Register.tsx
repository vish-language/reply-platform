import { useState } from "react";
import { login, register } from "./auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  });
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await register(form);

      console.log("REGISTER SUCCESS", response);

      const loginResponse   = await login({email : form.email, password: form.password});

      loginUser(loginResponse.data.accessToken, loginResponse.data.user);

      const selectedPlan = localStorage.getItem("selectedPlan");

      if (selectedPlan) {
        navigate("/checkout");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="space-y-4 w-96">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Organization"
          onChange={(e) =>
            setForm({
              ...form,
              organizationName: e.target.value,
            })
          }
        />

        <button className="bg-black text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}
