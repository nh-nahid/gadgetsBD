"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const isOwner = role === "SHOP_OWNER";

  const validateForm = (form) => {
    const newErrors = {};

    if (!form.name.value.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.value) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.value)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.mobile.value) {
      newErrors.mobile = "Mobile number is required";
    }

    if (isOwner && !form.shopName.value.trim()) {
      newErrors.shopName = "Shop name is required";
    }

    if (!form.password.value) {
      newErrors.password = "Password is required";
    } else if (form.password.value.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.passwordConfirm.value) {
      newErrors.passwordConfirm = "Please confirm your password";
    } else if (form.password.value !== form.passwordConfirm.value) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setErrors({});

    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role,
      shopName: isOwner ? form.shopName.value : null,
      mobile: form.mobile.value,
    };

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrors({ api: result.error || "Something went wrong" });
        return;
      }

      // If USER → redirect to login
      if (!isOwner) {
        router.replace("/login");
        return;
      }

      // If SHOP_OWNER → auto login
      const login = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (login?.error) {
        setErrors({ api: "Auto-login failed" });
        return;
      }

      router.replace("/profile");
    } catch (err) {
      setLoading(false);
      setErrors({ api: "Server error. Please try again." });
    }
  };

  const inputClass = (field) =>
    `w-full px-2 py-1.5 border rounded-sm outline-none ${
      errors[field]
        ? "border-red-500"
        : "border-gray-400 focus:border-amazon-secondary"
    }`;

  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <Logo />

      <div className="w-full max-w-[400px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-4">Create account</h1>

        {errors.api && (
          <p className="text-red-500 text-sm mb-3">{errors.api}</p>
        )}

        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-sm">
          <button
            type="button"
            onClick={() => {
              setRole("USER");
              setErrors({});
            }}
            className={`flex-1 py-1 text-xs font-bold rounded-sm ${
              !isOwner ? "bg-white shadow-sm" : "text-gray-500"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("SHOP_OWNER");
              setErrors({});
            }}
            className={`flex-1 py-1 text-xs font-bold rounded-sm ${
              isOwner ? "bg-white shadow-sm" : "text-gray-500"
            }`}
          >
            Shop Owner
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold mb-1">Your name</label>
            <input name="name" className={inputClass("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {isOwner && (
            <div>
              <label className="block text-sm font-bold mb-1">
                Shop name
              </label>
              <input name="shopName" className={inputClass("shopName")} />
              {errors.shopName && (
                <p className="text-xs text-red-500">
                  {errors.shopName}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">
              Mobile number
            </label>
            <input
              name="mobile"
              type="tel"
              className={inputClass("mobile")}
            />
            {errors.mobile && (
              <p className="text-xs text-red-500">{errors.mobile}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              name="email"
              type="email"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              name="password"
              className={inputClass("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Re-enter password
            </label>
            <input
              type="password"
              name="passwordConfirm"
              className={inputClass("passwordConfirm")}
            />
            {errors.passwordConfirm && (
              <p className="text-xs text-red-500">
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-1.5 a-button-primary text-sm font-medium rounded-sm ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Creating account..."
              : "Create your Gadgets BD account"}
          </button>
        </form>

        {role === "USER" && (
          <div className="mt-4 flex justify-center gap-2 items-center text-sm">
            <span>or continue with</span>
            <button
              type="button"
              onClick={() =>
                (window.location.href = "/api/auth/signin/google")
              }
              className="flex items-center gap-2 p-2 border rounded"
            >
              <Image
                src="/google-icon.png"
                alt="Google"
                width={16}
                height={16}
              />
              Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
