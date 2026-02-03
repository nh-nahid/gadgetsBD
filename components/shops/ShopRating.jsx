import { Star, StarHalf } from "lucide-react";

export default function ShopRating({ average, count }) {
  const fullStars = Math.floor(average);
  const halfStar = average % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1 mb-2">
      <div className="flex text-amazon-secondary">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
        {halfStar && <StarHalf className="w-4 h-4 fill-current" />}
      </div>
      <span className="text-xs text-amazon-blue">
        {count.toLocaleString()} ratings
      </span>
    </div>
  );
}
