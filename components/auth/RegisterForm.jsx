"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterForm() {
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isOwner = role === "SHOP_OWNER";

  const handleSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation(); // <-- prevents any bubbling native form submit

  const form = e.target;
  const password = form.password.value;
  const passwordConfirm = form.passwordConfirm.value;

  if (password !== passwordConfirm) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  const data = {
    name: form.name.value,
    email: form.email.value,
    password,
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
      alert(result.error || "Something went wrong");
      return;
    }

    // SPA-friendly navigation
    router.replace(role === "SHOP_OWNER" ? "/profile" : "/login");
  } catch (err) {
    setLoading(false);
    alert(err.message || "Server error");
  }
};


  return (
    <div className="bg-white text-amazon-text flex flex-col min-h-screen items-center pt-8">
      <Logo />
      <div className="w-full max-w-[400px] p-6 a-box mb-6">
        <h1 className="text-2xl font-normal mb-4">Create account</h1>

        {/* Role selection */}
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-sm">
          <button
            type="button"
            onClick={() => setRole("USER")}
            className={`flex-1 py-1 text-xs font-bold rounded-sm ${
              !isOwner ? "bg-white shadow-sm" : "text-gray-500"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("SHOP_OWNER")}
            className={`flex-1 py-1 text-xs font-bold rounded-sm ${
              isOwner ? "bg-white shadow-sm" : "text-gray-500"
            }`}
          >
            Shop Owner
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-1">
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="First and last name"
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm"
            />
          </div>

          {/* Shop Name only for owners */}
          {isOwner && (
            <div>
              <label htmlFor="shopName" className="block text-sm font-bold mb-1">
                Shop name
              </label>
              <input
                id="shopName"
                name="shopName"
                type="text"
                required={isOwner}
                placeholder="Your shop name"
                className="w-full px-2 py-1.5 border border-gray-400 rounded-sm"
              />
            </div>
          )}

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-bold mb-1">
              Mobile number
            </label>
            <div className="flex gap-2">
              <select className="px-2 py-1.5 border border-gray-400 rounded-sm">
                <option>BD +880</option>
              </select>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                placeholder="Mobile number"
                className="flex-1 px-2 py-1.5 border border-gray-400 rounded-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="At least 6 characters"
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm"
            />
            <p className="text-xs text-gray-600 mt-1">
              Passwords must be at least 6 characters.
            </p>
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-bold mb-1">
              Re-enter password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              className="w-full px-2 py-1.5 border border-gray-400 rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-1.5 a-button-primary text-sm font-medium rounded-sm ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating account..." : "Create your Gadgets BD account"}
          </button>
        </form>

        {/* Google Sign Up */}
        <div className="mt-4 flex justify-center gap-2 items-center text-sm">
          <span>or continue with</span>
          <button
            type="button"
            className="flex items-center gap-2 p-2 border rounded"
            onClick={() => window.location.href = "/api/auth/signin/google"}
          >
            <Image
              src="/google-icon.png"
              alt="Google"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
