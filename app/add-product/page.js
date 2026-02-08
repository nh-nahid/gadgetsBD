"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Header from "@/components/add-product/Header";
import ProductIdentity from "@/components/add-product/ProductIdentity";
import PricingInventory from "@/components/add-product/PricingInventory";
import ProductImages from "@/components/add-product/ProductImages";
import Specifications from "@/components/add-product/Specifications";
import ActionButtons from "@/components/add-product/ActionButtons";

export default function AddProductPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const shopId = session?.shop?.id;
  const isShopOwner = session?.user?.role === "SHOP_OWNER";

  const [form, setForm] = useState({
    title: "",
    category: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    availability: "In Stock",
    warranty: "No Warranty",
    specs: {
      processor: "",
      ram: "",
      storage: "",
      display: "",
      others: "",
    },
    images: [],
    features: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (status === "loading") return; 
    if (!session || !isShopOwner) {
      
      router.push("/"); 
    }
  }, [status, session, isShopOwner, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.specs) {
      setForm((prev) => ({ ...prev, specs: { ...prev.specs, [name]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  const updateFeature = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm((prev) => ({ ...prev, features: newFeatures }));
  };
  const removeFeature = (index) => {
    const newFeatures = [...form.features];
    newFeatures.splice(index, 1);
    setForm((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopId) {
      alert("Cannot find your shop. Are you logged in?");
      return;
    }

    const newErrors = {};
    if (!form.title) newErrors.title = "Product title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.brand) newErrors.brand = "Brand is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.stock) newErrors.stock = "Stock quantity is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        shop: {
          shopId,
          shopName: session?.shop?.name || session?.user?.shopName || "My Shop",
          isOfficial: session?.shop?.isOfficial || false,
          shopOwnerId: session?.user?.id,
        },
      };

      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create product ❌");
        setLoading(false);
        return;
      }

      alert("Product created successfully ✅");
      router.push("/manage-products?added=1");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };


  if (status === "loading" || !isShopOwner) {
    return <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amazon-blue mb-4"></div>
        <p className="text-gray-700 text-lg font-medium">Checking access...</p>
      </div>;
  }

  return (
    <main className="max-w-[1000px] mx-auto w-full p-6">
      <Header />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <ProductIdentity errors={errors} onChange={handleChange} value={form} />
        <PricingInventory errors={errors} onChange={handleChange} value={form} />
        <ProductImages onImagesChange={(imgs) => setForm({ ...form, images: imgs })} images={form.images} />
        <Specifications onChange={handleChange} value={form.specs} />

        <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
          <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-2">
            Product Features
          </h2>

          {form.features.map((feat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feat}
                placeholder={`Feature ${i + 1}`}
                onChange={(e) => updateFeature(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-400 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-amazon-yellow font-bold rounded"
          >
            + Add Feature
          </button>
        </div>

        <ActionButtons loading={loading} />
      </form>
    </main>
  );
}
