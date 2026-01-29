"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SocialLogins = ({ mode }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", {
      callbackUrl: "/", // redirect to homepage after login
    });
  };

  return (
    <div className="mt-4">
      {/* Divider text */}
      <div className="mb-2 flex justify-center gap-2 items-center text-sm">
        <span>or continue with</span>

        {/* Google Button */}
        <button
          type="button"
          className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <Image
            width={16}
            height={16}
            src="/google-icon.png"
            alt="Google"
            className="w-4 h-4"
          />
          Google
        </button>
      </div>

      {/* Alternate link */}
      <div className="text-center text-xs text-gray-500">
        {mode === "register" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline text-amazon-blue">
              Login
            </Link>
          </>
        ) : (
          <>
            New to Gadgets BD?{" "}
            <Link href="/register" className="underline text-amazon-blue">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialLogins;
