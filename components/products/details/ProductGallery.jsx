export default function ProductGallery({ mainImage, thumbnails }) {
  return (
    <div className="lg:col-span-5 flex gap-4">
      <div className="flex flex-col gap-2">
        {thumbnails.map((img, idx) => (
          <button
            key={idx}
            className="w-10 h-10 border border-gray-300 rounded overflow-hidden hover:shadow-md"
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <div className="flex-1 border border-gray-200 rounded p-4 bg-gray-50">
        <img src={mainImage} className="w-full h-auto object-cover" />
      </div>
    </div>
  );
}
