"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { CheckCircle } from "lucide-react";

const ForgotPass = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const email = e.target.email.value;

    try {
      setLoading(true);

      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Server error, try again later");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <Logo />

      <div className="w-full max-w-[350px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-2">Password assistance</h1>
        <p className="text-sm mb-4">
          Enter the email address associated with your account.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={loading}
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm outline-none focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-1.5 rounded-sm a-button-primary text-sm shadow-sm disabled:opacity-60"
          >
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-sm text-xs text-green-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <strong>Check your email</strong>
                <p className="mt-1">
                  We&apos;ve sent a password reset link to your email address.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-sm text-xs text-red-800">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
