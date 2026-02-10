"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function ShopEdit({ shop, setShop, setIsEditMode }) {
  const [bannerPreview, setBannerPreview] = useState(shop.coverImage || "");
  const [bannerFile, setBannerFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (data) => {
    const err = {};
    if (!data.name) err.name = "Shop name is required";
    if (!data.ownerName) err.ownerName = "Owner name is required";
    if (!data.email) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) err.email = "Invalid email address";
    if (!data.phone) err.phone = "Phone number is required";
    if (!data.description) err.description = "Description is required";
    if (!data.address) err.address = "Address is required";
    if (data.yearEstablished) {
      const year = Number(data.yearEstablished);
      if (year < 1900 || year > new Date().getFullYear()) {
        err.yearEstablished = "Enter a valid year";
      }
    }
    if (data.employees && Number(data.employees) < 0) {
      err.employees = "Employees cannot be negative";
    }
    return err;
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newErrors = { ...errors };
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      newErrors.banner = "Only JPG or PNG images allowed";
      setErrors(newErrors);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      newErrors.banner = "Image must be under 5MB";
      setErrors(newErrors);
      return;
    }
    if (newErrors.banner) delete newErrors.banner;
    setErrors(newErrors);

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      name: form.name.value,
      ownerName: form.ownerName.value,
      email: form.email.value,
      phone: form.phone.value,
      description: form.description.value,
      city: form.city.value || shop.location.city || "Unknown",
      specializesIn: form.specializesIn.value || shop.specializesIn?.[0] || "General",
      address: form.address.value || "",
      yearEstablished: form.yearEstablished.value,
      employees: form.employees.value,
      brands: form.brands.value,
      website: form.website.value,
    };

    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    let coverImage = shop.coverImage;

    // Upload new banner if selected
    if (bannerFile) {
      try {
        const bannerForm = new FormData();
        bannerForm.append("file", bannerFile);

        const uploadRes = await fetch("/api/shop/upload-banner", {
          method: "POST",
          body: bannerForm,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.url) {
          throw new Error("Image upload failed");
        }

        coverImage = uploadData.url;
      } catch (err) {
        console.error("Error uploading banner:", err);
        alert("Banner upload failed ❌");
        setLoading(false);
        return;
      }
    }

    const payload = {
      name: formData.name,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      description: formData.description,
      location: {
        city: formData.city,
        country: "Bangladesh",
      },
      specializesIn: [formData.specializesIn],
      address: formData.address,
      yearEstablished: formData.yearEstablished ? Number(formData.yearEstablished) : null,
      employees: formData.employees ? Number(formData.employees) : null,
      brands: formData.brands
        ? formData.brands.split(",").map((b) => b.trim()).filter(Boolean)
        : [],
      website: formData.website || "",
      coverImage,
    };

    try {
      const res = await fetch("/api/shop/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Update failed");

      // ✅ Update parent immediately
      setShop(resData.shop);
      alert("Shop updated successfully ✅");
      setIsEditMode(false);
    } catch (err) {
      console.error("Error updating shop:", err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* --- Basic Information --- */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
          <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
            Basic Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-bold mb-1">Shop Name *</label>
            <input
              name="name"
              type="text"
              defaultValue={shop.name}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          {/* Owner Name */}
          <div>
            <label className="block text-sm font-bold mb-1">Owner Name *</label>
            <input
              name="ownerName"
              type="text"
              defaultValue={shop.ownerName}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-1">Email *</label>
            <input
              name="email"
              type="email"
              defaultValue={shop.email}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-bold mb-1">Phone Number *</label>
            <input
              name="phone"
              type="tel"
              defaultValue={shop.phone}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Shop Description *</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={shop.description}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* --- Location & Specialization --- */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
          <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
            Location & Specialization
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-1">City/Location *</label>
            <select
              name="city"
              defaultValue={shop.location?.city || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            >
              <option>Dhaka</option>
              <option>Chittagong</option>
              <option>Sylhet</option>
              <option>Rajshahi</option>
              <option>Khulna</option>
              <option>Barisal</option>
              <option>Rangpur</option>
              <option>Mymensingh</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Specialization *</label>
            <select
              name="specializesIn"
              defaultValue={shop.specializesIn?.[0] || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-md"
            >
              <option>Laptops & PCs</option>
              <option>Smartphones</option>
              <option>Gaming Gear</option>
              <option>Audio & Headphones</option>
              <option>Cameras & Lenses</option>
              <option>Wearables</option>
              <option>Accessories</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Full Address *</label>
            <textarea
              name="address"
              rows={2}
              defaultValue={shop.address}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
          </div>
        </div>
      </div>

      {/* --- Banner Upload --- */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
          <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
            Shop Banner Image
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Current Banner</label>
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-md border border-gray-300">
              {bannerPreview && (
                <Image
                  src={bannerPreview}
                  alt="Current Banner"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Upload New Banner</label>
            <label
              htmlFor="bannerUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-amazon-blue transition-colors"
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG up to 5MB (Recommended: 1200 x 400 pixels)
              </p>
              <input
                name="banner"
                id="bannerUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
              {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner}</p>}
            </label>
          </div>
        </div>
      </div>

      {/* --- Additional Information --- */}
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
          <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
            Additional Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-1">Year Established</label>
            <input
              name="yearEstablished"
              type="number"
              defaultValue={shop.yearEstablished}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Number of Employees</label>
            <input
              name="employees"
              type="number"
              defaultValue={shop.employees}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Official Brand Partnerships (Optional)</label>
            <input
              name="brands"
              type="text"
              defaultValue={shop.brands?.join(", ") || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple brands with commas</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-1">Website URL (Optional)</label>
            <input
              name="website"
              type="text"
              defaultValue={shop.website}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue"
            />
          </div>
        </div>
      </div>

      {/* --- Buttons --- */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
        <button
          onClick={() => setIsEditMode(false)}
          type="button"
          className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="px-6 py-2 bg-amazon-yellow font-bold rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
