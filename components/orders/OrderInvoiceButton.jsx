"use client";

import { Download } from "lucide-react";

const OrderInvoiceButton = ({ orderId }) => {
  
const handleDownload = () => {
  if (!orderId) {
    alert("Order ID missing!");
    return;
  }

  console.log("Downloading invoice for orderId:", orderId);
  window.open(`/api/orders/${orderId}/invoice`, "_blank");
};


  return (
    <button
      onClick={handleDownload}
      className="px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50 flex items-center gap-1"
    >
      <Download className="w-3 h-3" />
      Download Invoice
    </button>
  );
};

export default OrderInvoiceButton;
