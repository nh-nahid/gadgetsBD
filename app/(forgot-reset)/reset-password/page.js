"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import Logo from "@/components/auth/Logo";

const ResetPassword = ({ searchParams }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const token = searchParams?.token;
  const email = searchParams?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token || !email) {
      setMessage("Invalid or expired reset link");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessage("success");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setMessage("Server error, try again later");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <Logo />

      <div className="w-full max-w-[350px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-2">Reset password</h1>
        <p className="text-sm mb-4">
          Enter a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">
              New password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Re-enter password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={loading || message === "success"}
            className="w-full py-1.5 rounded-sm a-button-primary text-sm shadow-sm disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        {message === "success" && (
          <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-sm text-xs text-green-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Password updated</strong>
                <p className="mt-1">
                  Your password has been reset. Redirecting to login…
                </p>
              </div>
            </div>
          </div>
        )}

        {message && message !== "success" && (
          <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-sm text-xs text-red-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p>{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
