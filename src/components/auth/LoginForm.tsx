"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Response:", data);

 if (!response.ok) {
  alert(data.message ?? "Login failed.");
  return;
}

// Temporary test
window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mobile Number / Email
        </label>

        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Enter mobile number or email"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-600"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>

        <PasswordInput
          value={password}
          onChange={setPassword}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(e.target.checked)
            }
          />
          Remember Me
        </label>

        <button
          type="button"
          className="text-sm text-emerald-700 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Signing In..." : "Login"}
      </button>
    </form>
  );
}