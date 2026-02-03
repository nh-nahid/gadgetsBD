"use client";
import Link from "next/link";

export default function ShopPagination({ page, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {page > 1 && (
        <Link
          href={`/shops?page=${page - 1}`}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Prev
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`/shops?page=${p}`}
          className={`px-4 py-2 border rounded-md ${
            p === page ? "bg-amazon-yellow font-bold" : "hover:bg-gray-50"
          }`}
        >
          {p}
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={`/shops?page=${page + 1}`}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  );
}
