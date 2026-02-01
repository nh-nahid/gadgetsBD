import { Star } from 'lucide-react';

export default function StarRating({ value, size = 4 }) {
  return (
    <div className="flex text-amazon-secondary">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-${size} h-${size} ${i < value ? 'fill-current' : ''}`} />
      ))}
    </div>
  );
}
