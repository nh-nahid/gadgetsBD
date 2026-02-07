// lib/uploadProductImage.js
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/products/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return data.url;
};
