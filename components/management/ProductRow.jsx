import Image from "next/image";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProductRow({ product, fetchProducts, onEdit }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const statusColors = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "red" };
    if (stock > 0 && stock <= 5) return { text: "Low Stock", color: "yellow" };
    return { text: "In Stock", color: "green" };
  };
  const stockStatus = getStockStatus(product.stock);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch("/api/products/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, userId }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Delete failed ❌");

    alert("Product deleted successfully ✅");
    fetchProducts();
  };

  const handleToggleStatus = async () => {
    if (!userId) return alert("Unauthorized");

    const res = await fetch("/api/products/toggle-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, userId }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed to update status");

    alert(data.isActive ? "Product published ✅" : "Product unpublished ✅");
    fetchProducts(); 
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 text-center">
        <input type="checkbox" />
      </td>

      <td className="p-3">
        <span
          className={`inline-block px-2 py-1 text-xs font-bold rounded ${
            statusColors[stockStatus.color] || "bg-green-100 text-green-700"
          }`}
        >
          {stockStatus.text}
        </span>
      </td>

      <td className="p-3">
        <Image
          src={product.image || "/placeholder.png"}
          width={48}
          height={48}
          alt={product.title}
          className="object-cover rounded border border-gray-200"
        />
      </td>

      <td className="p-3">
        <div className="font-medium">{product.title}</div>
        <div className="text-xs text-gray-500">SKU: {product.sku}</div>
      </td>

      <td className="p-3 text-gray-600">{product.category}</td>
      <td className="p-3 text-gray-600">{product.brand}</td>
      <td className="p-3 font-bold">{product.price}</td>

      <td className="p-3">
        <span
          className={`font-bold ${
            stockStatus.color === "red"
              ? "text-red-600"
              : stockStatus.color === "yellow"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {product.stock}
        </span>
      </td>

      
      <td className="p-3">
        <div className="flex items-center justify-end gap-2">
          
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            onClick={() => onEdit(product)}
          >
            <Pencil className="w-4 h-4 text-amazon-blue" />
          </button>

          
          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            onClick={handleToggleStatus}
          >
            {product.isActive ? (
              <Eye className="w-4 h-4 text-green-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-red-600" />
            )}
          </button>

          <button
            className="p-1.5 hover:bg-gray-100 rounded"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}
