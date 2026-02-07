"use client";

export default function Pagination({ total, pageSize = 10, currentPage = 1, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
      <div>Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} of {total} products</div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 border border-gray-300 rounded ${currentPage === i + 1 ? "bg-amazon-yellow font-bold" : "hover:bg-gray-50"}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
