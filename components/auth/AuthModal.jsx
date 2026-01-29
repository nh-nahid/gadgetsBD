"use client";
import { usePathname, useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal() {
  const pathname = usePathname(); // current URL
  const router = useRouter();

  // Determine which form to show
  let FormComponent = null;
  if (pathname.includes("/login")) FormComponent = LoginForm;
  else if (pathname.includes("/register")) FormComponent = RegisterForm;

  // If not login/register, don’t render modal
  if (!FormComponent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start pt-[4vh]">
      <div
        className="
          relative bg-white w-full max-w-[420px]
          rounded-md p-5
          max-h-[92vh]
          overflow-y-auto
          scrollbar-hide
        "
      >
        <button
          onClick={() => router.back()} // go back to previous page
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <FormComponent />
      </div>
    </div>
  );
}
