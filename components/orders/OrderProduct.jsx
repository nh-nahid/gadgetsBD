"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import OrderInvoiceButton from "./OrderInvoiceButton";
import OrderReviewCard from "./OrderReviewCard";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderProduct = ({ product, isFirst, role, orderId }) => {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(true);
  const [productStatus, setProductStatus] = useState(product.status); // local status

  // Fetch existing review for this product by the user
  useEffect(() => {
    if (role === "USER" && userId) {
      const fetchReview = async () => {
        setLoadingReview(true);
        try {
          const res = await fetch(`/api/reviews?productId=${product.productId}`);
          const data = await res.json();

          const myReview = data.reviews?.find(r => r.userId === userId);
          setExistingReview(myReview || null);
        } catch (err) {
          console.error("Failed to fetch review:", err);
        } finally {
          setLoadingReview(false);
        }
      };

      fetchReview();
    }
  }, [product.productId, role, userId]);

  // Cancel order handler
  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.productId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order cancelled successfully!");
        setProductStatus("cancelled"); // update UI
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className={`flex gap-4 ${!isFirst ? "pt-6 border-t border-gray-200" : ""}`}>
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-32 h-32 object-cover border border-gray-200 rounded"
      />

      <div className="flex-1">
        {/* Product Info */}
        <a
          href={`/products/${product.productId}`}
          className="text-amazon-blue hover:underline font-bold text-sm"
        >
          {product.name}
        </a>
        <p className="text-xs text-gray-600 mt-1">Sold by: {product.seller}</p>
        <p className="text-xs text-gray-600 mt-1">Quantity: {product.quantity}</p>

        {/* Status Badge */}
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-3 py-1 ${statusColors[productStatus]} text-xs font-bold rounded-full`}
          >
            {productStatus === "delivered" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : productStatus === "shipped" ? (
              <Truck className="w-3 h-3 mr-1" />
            ) : null}
            {productStatus?.charAt(0)?.toUpperCase() + productStatus?.slice(1)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 flex-wrap items-center">
          {/* Invoice Button */}
          {role === "USER" && (
            <div className="flex-shrink-0">
              <OrderInvoiceButton orderId={orderId} />
            </div>
          )}

          {/* Cancel Order (only pending or confirmed) */}
          {(productStatus === "pending" || productStatus === "confirmed") && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-1.5 border border-red-300 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100 flex items-center gap-1 flex-shrink-0"
            >
              <XCircle className="w-3 h-3" />
              Cancel Order
            </button>
          )}

          {/* Write Review Button */}
          {role === "USER" &&
            productStatus === "delivered" &&
            !showReviewForm &&
            !existingReview &&
            !loadingReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex-shrink-0"
              >
                Write a Review
              </button>
            )}

          {/* Buy it again */}
          {role === "USER" && productStatus === "delivered" && (
            <button
              onClick={() => router.push(`/cart?reorder=${orderId}`)}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex-shrink-0"
            >
              Buy it again
            </button>
          )}

          {/* Shop Owner dropdown */}
          {role === "SHOP_OWNER" && (
            <select
              value={productStatus}
              onChange={(e) =>
                console.log(
                  `Change status API: ${orderId}, ${product.productId}, ${e.target.value}`
                )
              }
              className="border rounded px-2 py-1 text-xs flex-shrink-0"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && !existingReview && (
          <div className="mt-2 w-full max-w-md">
            <OrderReviewCard
              productId={product.productId}
              setShowReviewForm={setShowReviewForm}
              onReviewSubmitted={(review) => {
                console.log("Review submitted:", review);
                setExistingReview(review);
                setShowReviewForm(false);
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Thank You Message */}
        {existingReview && !showReviewForm && (
          <div className="mt-2 p-2 border rounded-md bg-green-50 text-green-800 text-xs max-w-md">
            Thank you for your review!
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderProduct;
