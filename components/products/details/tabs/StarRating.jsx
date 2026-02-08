"use client";

export default function StarRating({ value = 0, onChange, size = 5 }) {
  const stars = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          fill={star <= value ? "#FBBF24" : "none"} 
          viewBox="0 0 24 24"
          stroke="#FBBF24"
          strokeWidth={2}
          className="w-5 h-5 cursor-pointer"
          onClick={() => onChange(star)} 
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17.27L18.18 21l-1.64-7.03
               L22 9.24l-7.19-.61L12 2 9.19 8.63
               2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
}
