"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import OrderInvoiceButton from "./OrderInvoiceButton";
import OrderReviewCard from "./OrderReviewCard";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusOrder = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderProduct = ({
  product,
  isFirst,
  role,
  orderId,
  orderNumber,
}) => {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(true);
  const [productStatus, setProductStatus] = useState(product.status);

  useEffect(() => {
    if (role === "USER" && userId) {
      const fetchReview = async () => {
        setLoadingReview(true);
        try {
          const res = await fetch(
            `/api/reviews?productId=${product.productId}`
          );
          const data = await res.json();
          const myReview =
            productStatus === "delivered"
              ? data.reviews?.find((r) => r.userId === userId)
              : null;
          setExistingReview(myReview || null);
        } catch (err) {
          console.error("Failed to fetch review:", err);
        } finally {
          setLoadingReview(false);
        }
      };
      fetchReview();
    }
  }, [product.productId, role, userId, productStatus]);

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
        setProductStatus("cancelled");
        alert("Order cancelled successfully!");
        router.refresh();
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  const handleReorder = async () => {
    if (!confirm("Do you want to reorder this product?")) return;
    try {
      const payload = {
        productId: product.productId,
        quantity: product.quantity,
        userId,
        title: product.name,
        slug: product.slug || "",
        shopName: product.seller,
        price: product.price,
        image: product.image,
        currency: "BDT",
        freeShipping: !!product.freeDelivery,
      };

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        alert("Failed to add to cart: " + errMsg);
        return;
      }

      router.push("/payment");
    } catch (err) {
      console.error("Reorder error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  const handleChangeStatus = async (newStatus) => {
    if (newStatus === productStatus) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.productId,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProductStatus(newStatus);
        alert("Status updated successfully!");
        router.refresh();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  };

  const canWriteReview =
    role === "USER" &&
    productStatus === "delivered" &&
    !existingReview &&
    !loadingReview;

  const showThankYou =
    role === "USER" &&
    productStatus === "delivered" &&
    existingReview &&
    !loadingReview;

  return (
    <div
      className={`flex gap-4 ${
        !isFirst ? "pt-6 border-t border-gray-200" : ""
      }`}
    >
      {/* Product Image */}
      <div className="w-32 h-32 flex-shrink-0 relative">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="128px"
          className="object-cover border border-gray-200 rounded"
        />
      </div>

      <div className="flex-1">
        <Link
          href={`/products/${product.productId}`}
          className="text-amazon-blue hover:underline font-bold text-sm"
        >
          {product.name}
        </Link>

        <p className="text-xs text-gray-600 mt-1">
          Sold by: {product.seller}
        </p>

        <p className="text-xs text-gray-600 mt-1">
          Quantity: {product.quantity}
        </p>

        <div className="mt-2">
          <span
            className={`inline-flex items-center px-3 py-1 ${
              statusColors[productStatus]
            } text-xs font-bold rounded-full`}
          >
            {productStatus === "delivered" && (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {productStatus === "shipped" && (
              <Truck className="w-3 h-3 mr-1" />
            )}
            {productStatus.charAt(0).toUpperCase() +
              productStatus.slice(1)}
          </span>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap items-center">
          {role === "USER" && (
            <OrderInvoiceButton orderId={orderNumber} />
          )}

          {(productStatus === "pending" ||
            productStatus === "confirmed") &&
            role === "USER" && (
              <button
                onClick={handleCancelOrder}
                className="px-4 py-1.5 border border-red-300 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100 flex items-center gap-1 flex-shrink-0"
              >
                <XCircle className="w-3 h-3" /> Cancel Order
              </button>
            )}

          {canWriteReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex-shrink-0"
            >
              Write a Review
            </button>
          )}

          {role === "USER" && (
            <button
              onClick={handleReorder}
              className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex-shrink-0"
            >
              Buy it again
            </button>
          )}

          {role === "SHOP_OWNER" &&
            statusOrder.map((status) => (
              <button
                key={status}
                onClick={() => handleChangeStatus(status)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0
                  ${
                    productStatus === status
                      ? "opacity-100 border-gray-600"
                      : "opacity-80 hover:opacity-100"
                  }
                  ${
                    status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                      : status === "confirmed"
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : status === "shipped"
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : status === "delivered"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
        </div>

        {showReviewForm && !existingReview && (
          <div className="mt-2 w-full max-w-md">
            <OrderReviewCard
              productId={product.productId}
              setShowReviewForm={setShowReviewForm}
              onReviewSubmitted={(review) => {
                setExistingReview(review);
                setShowReviewForm(false);
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {showThankYou && (
          <div className="mt-2 p-2 border rounded-md bg-green-50 text-green-800 text-xs max-w-md">
            Thank you for your review!
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderProduct;
