"use client";

import { useState, useEffect } from "react";
import StarRating from "./StarRating";

export default function ReviewForm({ productId, userId, userName, existingReview, onSubmit, onCancel }) {
  const [review, setReview] = useState({
    rating: 0,
    title: "",
    comment: "",
  });

  useEffect(() => {
    if (existingReview) {
      setReview({
        rating: existingReview.rating,
        title: existingReview.title,
        comment: existingReview.comment,
      });
    }
  }, [existingReview]);

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

    if (!review.rating || !review.title || !review.comment) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const method = existingReview ? "PUT" : "POST";
      const url = existingReview ? `/api/reviews/${existingReview.id}` : "/api/reviews";

      const body = {
        ...review,
        productId,
        userId,
        name: userName || "User",
        initials: getInitials(userName),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        onSubmit(data.review);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col gap-2 border p-4 rounded-md bg-gray-50"
    >
      <label className="flex flex-col">
        Rating:
        <StarRating
          value={review.rating}
          onChange={(val) => setReview((prev) => ({ ...prev, rating: val }))}
          size={5}
        />
      </label>

      <label className="flex flex-col">
        Title:
        <input
          type="text"
          value={review.title}
          onChange={(e) => setReview((prev) => ({ ...prev, title: e.target.value }))}
          className="border px-2 py-1 rounded"
        />
      </label>

      <label className="flex flex-col">
        Comment:
        <textarea
          value={review.comment}
          onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
          className="border px-2 py-1 rounded"
        />
      </label>

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-4 py-2 rounded-md text-sm font-medium border border-amazon-secondary"
        >
          {existingReview ? "Update Review" : "Submit Review"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
