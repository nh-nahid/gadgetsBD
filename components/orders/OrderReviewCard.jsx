"use client";

import { useState } from "react";
import StarRating from "../products/details/tabs/StarRating";
import { useSession } from "next-auth/react";

const OrderReviewCard = ({ productId, onReviewSubmitted, setShowReviewForm }) => {
  const [review, setReview] = useState({
    rating: 0,
    title: "",
    comment: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const session = useSession()

  const userId = session?.data?.user?.id
  const userName = session?.data?.user?.name


  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.rating || !review.title.trim() || !review.comment.trim()) {
      alert("Please provide a rating, title, and comment!");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...review,
          productId,
          userId,
          name: userName || "User",
          initials: getInitials(userName),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        onReviewSubmitted && onReviewSubmitted(data.review);

        setTimeout(() => {
          setShowReviewForm(false);
        }, 3000);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  if (submitted) {
    return (
      <div className="mt-2 p-4 border rounded-md bg-gray-50 text-xs w-full max-w-md">
        Thank you for your review!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 p-4 border rounded-md bg-gray-50 w-full max-w-md flex flex-col gap-2 text-xs"
    >
      {/* Rating */}
      <div className="flex items-center gap-2">
        <span className="w-16">Rating:</span>
        <StarRating
          value={review.rating}
          onChange={(val) => setReview((prev) => ({ ...prev, rating: val }))}
          size={5}
        />
      </div>

      {/* Title */}
      <input
        type="text"
        value={review.title}
        onChange={(e) => setReview((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="Review title"
        className="border px-2 py-1 rounded text-xs w-full"
      />

      {/* Comment */}
      <textarea
        value={review.comment}
        onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
        placeholder="Write your review..."
        className="border px-2 py-1 rounded text-xs resize-none w-full"
        rows={2}
      />

      {/* Buttons */}
      <div className="flex gap-2 mt-1">
        <button
          type="submit"
          className="px-3 py-1.5 bg-amazon-yellow hover:bg-amazon-yellow_hover rounded text-xs font-medium"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={() => setShowReviewForm(false)}
          className="px-3 py-1.5 border border-gray-300 rounded text-xs hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default OrderReviewCard;
