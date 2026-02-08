
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="rounded-xl bg-black text-white px-6 py-3 hover:opacity-90 transition"
      >
        Go back home
      </Link>
    </div>
  );
}
