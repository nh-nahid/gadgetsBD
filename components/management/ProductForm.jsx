"use client";
import { useState, useEffect } from "react";
import ActionButtons from "@/components/add-product/ActionButtons";
import ProductIdentity from "@/components/add-product/ProductIdentity";
import PricingInventory from "@/components/add-product/PricingInventory";
import ProductImages from "@/components/add-product/ProductImages";
import Specifications from "@/components/add-product/Specifications";
import { useSession } from "next-auth/react";

export default function ProductForm({ product = null, onClose, onSaved, fetchProducts }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

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
    specs: { processor: "", ram: "", storage: "", display: "", others: "" },
    images: [],
    features: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        category: product.category || "",
        brand: product.brand || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        sku: product.sku || "",
        availability: product.availability || "In Stock",
        warranty: product.warranty || "No Warranty",
        specs: product.specs || { processor: "", ram: "", storage: "", display: "", others: "" },
        images: product.images || [],
        features: product.features || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.specs) {
      setForm(prev => ({ ...prev, specs: { ...prev.specs, [name]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => setForm(prev => ({ ...prev, features: [...prev.features, ""] }));
  const updateFeature = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm(prev => ({ ...prev, features: newFeatures }));
  };
  const removeFeature = (index) => {
    const newFeatures = [...form.features];
    newFeatures.splice(index, 1);
    setForm(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("You must be logged in");

    // ---------------- Validation ----------------
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.brand) newErrors.brand = "Brand is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.stock) newErrors.stock = "Stock is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const endpoint = product ? "/api/products/update" : "/api/products/create";
      
      const payload = product
        ? { productId: product.id, userId, ...form } // EDIT: send userId + all fields
        : { ...form, shop: { shopOwnerId: userId } }; // CREATE: send shopOwnerId

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to save product");

      alert(product ? "Product updated ✅" : "Product created ✅");
      onSaved?.();
      fetchProducts?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded p-6 mb-6 shadow">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <ProductIdentity errors={errors} value={form} onChange={handleChange} />
        <PricingInventory errors={errors} value={form} onChange={handleChange} />
        <ProductImages images={form.images} onImagesChange={(imgs) => setForm({ ...form, images: imgs })} />
        <Specifications value={form.specs} onChange={handleChange} />

        <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
          <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-2">Product Features</h2>
          {form.features.map((feat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feat}
                placeholder={`Feature ${i + 1}`}
                onChange={(e) => updateFeature(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-400 rounded-md"
              />
              <button type="button" onClick={() => removeFeature(i)} className="px-3 py-2 bg-red-500 text-white rounded">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="px-4 py-2 bg-amazon-yellow font-bold rounded">+ Add Feature</button>
        </div>

        <ActionButtons loading={loading} />
      </form>
    </div>
  );
}
