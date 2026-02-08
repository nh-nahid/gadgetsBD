"use client";

import Link from "next/link";
import React, { useState } from "react";
import Logo from "./Logo";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SocialLogins from "./SocialLogins";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const validateForm = (email, password) => {
    const errors = { email: "", password: "" };

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  async function onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    setError("");
    setFieldErrors({ email: "", password: "" });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const validationErrors = validateForm(email, password);

    if (validationErrors.email || validationErrors.password) {
      setFieldErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      setLoading(false);

      if (response?.error) {
        setError(response.error);
      } else {
        window.dispatchEvent(new Event("auth-changed"));
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <Logo />

      {error && (
        <div className="text-lg text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <div className="w-full max-w-[350px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-4">Sign in</h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-1">
              Email or mobile phone number
            </label>

            <input
              name="email"
              type="email"
              id="email"
              disabled={loading}
              className={`w-full px-2 py-1.5 border rounded-sm outline-none focus:ring-1
                ${
                  fieldErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-400 focus:ring-amazon-secondary focus:border-amazon-secondary"
                }`}
            />

            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="text-sm font-bold">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <input
              name="password"
              type="password"
              id="password"
              disabled={loading}
              className={`w-full px-2 py-1.5 border rounded-sm outline-none focus:ring-1
                ${
                  fieldErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-400 focus:ring-amazon-secondary focus:border-amazon-secondary"
                }`}
            />

            {fieldErrors.password && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-1.5 a-button-primary text-sm font-medium rounded-sm
              ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <SocialLogins mode="login" />

        <div className="mt-4 text-xs text-gray-600">
          <p>
            By continuing, you agree to Gadgets BD&apos;s{" "}
            <a href="#" className="text-amazon-blue hover:underline">
              Conditions of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-amazon-blue hover:underline">
              Privacy Notice
            </a>
            .
          </p>
        </div>

        <div className="mt-4">
          <a
            href="#"
            className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline flex items-center gap-1"
          >
            <ChevronRight className="w-3 h-3" />
            Need help?
          </a>
        </div>
      </div>

      <div className="w-full max-w-[350px] mb-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-500">
              New to Gadgets BD?
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[350px] mb-8">
        <Link
          href="/register"
          className="block w-full py-1.5 border border-gray-400 rounded-sm text-center text-sm hover:bg-gray-50 transition-colors"
        >
          Create your Gadgets BD account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
