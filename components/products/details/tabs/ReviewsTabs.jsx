import { useState } from "react";
import StarRating from "../StarRating";

export default function ReviewsTab({ reviews: initialReviews, productId }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [page, setPage] = useState(1); // tracks pages
  const [loading, setLoading] = useState(false);

  const loadMoreReviews = async () => {
    setLoading(true);
    const res = await fetch(`/api/reviews?productId=${productId}&page=${page + 1}`);
    const data = await res.json();
    setReviews([...reviews, ...data.reviews]);
    setPage(page + 1);
    setLoading(false);
  };

  if (!reviews.length) return <p>No reviews yet.</p>;

  const averageRating = reviews.reduce((a,v) => a + v.rating, 0) / reviews.length;

  return (
    <div id="reviews-tab" className="tab-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        <button className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-4 py-2 rounded-md text-sm font-medium border border-amazon-secondary">
          Write a Review
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <StarRating value={Math.round(averageRating)} size={5} />
          <span className="text-lg font-bold">{averageRating.toFixed(1)} out of 5</span>
        </div>
        <span className="text-sm text-gray-600">{reviews.length} global ratings</span>
      </div>

      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                {review.initials}
              </div>
              <div>
                <p className="font-bold text-sm">{review.name}</p>
                <StarRating value={review.rating} size={3} />
              </div>
            </div>
            <h4 className="font-bold text-sm mb-1">{review.title}</h4>
            <p className="text-xs text-gray-500 mb-2">{review.date}</p>
            <p className="text-sm">{review.content}</p>
          </div>
        ))}
      </div>

      <button
        onClick={loadMoreReviews}
        disabled={loading}
        className="mt-6 px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Load More Reviews"}
      </button>
    </div>
  );
}
