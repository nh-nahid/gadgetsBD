"use client";

import { useState } from "react";
import DescriptionTab from "./DescriptionTab";
import ReviewsTab from "./ReviewsTabs";
import ShopInfoTab from "./ShopInfoTab";

export default function ProductTabs({ description, features, reviews, shop, productId, canReview }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-12">
      <div className="border-b border-gray-300 mb-6 flex gap-8">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 px-1 text-sm font-medium ${
            activeTab === "description"
              ? "border-b-2 border-amazon-orange text-amazon-orange"
              : "text-gray-600 hover:text-amazon-orange"
          }`}
        >
          Description
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 px-1 text-sm font-medium ${
            activeTab === "reviews"
              ? "border-b-2 border-amazon-orange text-amazon-orange"
              : "text-gray-600 hover:text-amazon-orange"
          }`}
        >
          Reviews
        </button>

        <button
          onClick={() => setActiveTab("shop")}
          className={`pb-2 px-1 text-sm font-medium ${
            activeTab === "shop"
              ? "border-b-2 border-amazon-orange text-amazon-orange"
              : "text-gray-600 hover:text-amazon-orange"
          }`}
        >
          Shop Info
        </button>
      </div>
      <div>
        {activeTab === "description" && (
          <DescriptionTab description={description} features={features} />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab
            productId={productId}    
            reviews={reviews}        
            canReview={canReview}    
          />
        )}

        {activeTab === "shop" && <ShopInfoTab shop={shop} />}
      </div>
    </div>
  );
}
