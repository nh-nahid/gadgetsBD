"use client";

import { useSession } from "next-auth/react";
import ReviewForm from "./ReviewsForm";
import { useEffect, useState } from "react";
import StarRating from "../StarRatingAll";

export default function ReviewsTab({ reviews: initialReviews, productId }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name;

  const [reviews, setReviews] = useState(initialReviews || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const checkCanReview = async () => {
      if (!userId || !productId) return;
      try {
        const res = await fetch(
          `/api/reviews/can-review?productId=${productId}&userId=${userId}`
        );
        const data = await res.json();
        setCanReview(data.canReview);
      } catch (err) {
        console.error("Failed to check canReview:", err);
        setCanReview(false);
      }
    };
    checkCanReview();
  }, [userId, productId]);

 
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reviews?productId=${productId}&page=1`);
        const data = await res.json();
        setReviews(data.reviews || []);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [activeTab, productId]);

  const loadMoreReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&page=${page + 1}`);
      const data = await res.json();
      setReviews((prev) => [...prev, ...(data.reviews || [])]);
      setPage((p) => p + 1);
    } catch (err) {
      console.error("Failed to load more reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setEditReview(null);
      setShowForm(false);
      setCanReview(true); 
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setShowForm(true);
  };

  const handleSubmit = (updatedReview) => {
    if (editReview) {
      setReviews((prev) =>
        prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
      setEditReview(null);
    } else {
      setReviews((prev) => [updatedReview, ...prev]);
      setCanReview(false); 
    }
    setShowForm(false);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;


  const filteredReviews = reviews
    .filter((review) => {
      if (activeTab === "all") return true;
      if (activeTab === "verified") return review.verified;
      if (activeTab === "5star") return review.rating === 5;
      if (activeTab === "4star") return review.rating === 4;
      return true;
    })
    .sort((a, b) => {
      if (a.userId === userId) return -1;
      if (b.userId === userId) return 1;
      return 0;
    });

  return (
    <div id="reviews-tab" className="tab-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Customer Reviews</h2>

        {canReview && !showForm && (
          <button
            className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-4 py-2 rounded-md text-sm font-medium border border-amazon-secondary"
            onClick={() => setShowForm(true)}
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          productId={productId}
          userId={userId}
          userName={userName}
          existingReview={editReview}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditReview(null);
          }}
        />
      )}


      <div className="flex gap-4 mb-6 border-b border-gray-300">
        {[
          { key: "all", label: "All Reviews" },
          { key: "verified", label: "Verified Buyers" },
          { key: "5star", label: "5-Star" },
          { key: "4star", label: "4-Star" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px font-medium border-b-2 ${
              activeTab === tab.key
                ? "border-amazon-yellow text-amazon-yellow"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredReviews.length === 0 && <p>No reviews yet.</p>}
        {filteredReviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center gap-2 mb-1 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                  {review.initials}
                </div>
                <p className="font-bold text-sm">{review.name}</p>
                {review.verified && (
                  <span className="text-xs text-green-600 ml-2">
                    ✔ Verified Buyer
                  </span>
                )}
              </div>

              {review.userId === userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <StarRating value={review.rating} size={3} />
            <h4 className="font-bold text-sm">{review.title}</h4>
            <p className="text-xs text-gray-500">
              {new Date(review.date).toDateString()}
            </p>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
      </div>

      {filteredReviews.length > 0 && (
        <button
          onClick={loadMoreReviews}
          disabled={loading}
          className="mt-6 px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Reviews"}
        </button>
      )}

      <div className="mt-4">
        <p className="text-sm font-medium">
          Average Rating: {averageRating.toFixed(1)} / 5
        </p>
      </div>
    </div>
  );
}
