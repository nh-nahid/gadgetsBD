"use client";

import { useState, useEffect } from "react";
import Filters from "@/components/management/Filters";
import InventoryTable from "@/components/management/InventoryTable";
import Pagination from "@/components/management/Pagination";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import ProductForm from "@/components/management/ProductForm";


export default function InventoryPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const added = searchParams.get("added");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    brand: "",
    search: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  
  const fetchProducts = async (filters, page) => {
    if (!session?.user?.id) return;
    setLoading(true);

    const params = new URLSearchParams({
      userId: session.user.id,
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: filters.search || "",
      category: filters.category || "",
      brand: filters.brand || "",
      status: filters.status || "",
    });

    const res = await fetch(`/api/products/all?${params.toString()}`);
    const data = await res.json();

    setProducts(data.products);
    setTotal(data.total);
    setLoading(false);
  };

  const { status, category, brand, search } = filters;

  useEffect(() => {
    fetchProducts(filters, page);
  }, [status, category, brand, search, page, session?.user?.id]);

  useEffect(() => {
    if (added === "1") {
      fetchProducts(filters, page);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("added");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [added]);

  return (
    <main className="w-full p-6">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-normal">Manage Inventory</h1>
          <Link
            href="/add-product"
            className="bg-amazon-yellow hover:bg-amazon-yellow_hover px-6 py-2 rounded-md text-sm font-bold shadow-sm border border-amazon-secondary"
          >
            Add a Product
          </Link>
        </div>

        {/* Filters */}
        <Filters
          onFilter={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />

        {/* Inline Edit Form */}
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSaved={() => fetchProducts(filters, page)}
            fetchProducts={() => fetchProducts(filters, page)}
          />
        )}

        {/* Table or Loading / Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amazon-blue mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">Loading shop details...</p>
      </div>
        ) : total === 0 ? (
          <div className="text-center py-10 text-gray-500">No products found.</div>
        ) : (
          <>
            <InventoryTable
              products={products}
              fetchProducts={() => fetchProducts(filters, page)}
              onEdit={setEditingProduct}
            />
            <Pagination
              total={total}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
