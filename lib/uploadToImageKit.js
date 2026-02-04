export const uploadToImageKit = async (file) => {
  const authRes = await fetch("/api/imagekit-auth");
  const auth = await authRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", auth.publicKey);
  formData.append("signature", auth.signature);
  formData.append("expire", auth.expire);
  formData.append("token", auth.token);
  formData.append("folder", "/shop-banners");

  const uploadRes = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadRes.ok) {
    throw new Error("Image upload failed");
  }

  const data = await uploadRes.json();
  return data.url; 
};
