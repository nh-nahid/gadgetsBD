"use client";

import { useRouter } from "next/navigation";

export default function ActionButtons({ loading }) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-amazon-yellow hover:bg-amazon-yellow_hover border border-amazon-secondary rounded-md text-sm font-bold shadow-sm"
      >
        {loading ? "Publishing..." : "Publish Product"}
      </button>
    </div>
  );
}
