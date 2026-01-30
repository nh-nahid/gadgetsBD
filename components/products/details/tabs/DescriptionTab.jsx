export default function DescriptionTab({ description, features }) {
  return (
    <div id="description-tab" className="tab-content">
      <h2 className="text-xl font-bold mb-4">Product Description</h2>
      <div className="prose max-w-none text-sm">
        <p style={{ whiteSpace: 'pre-wrap' }} className="mb-4">{description}</p>
        <h3 className="font-bold mt-6 mb-2">Key Features:</h3>
        <ul className="list-disc list-inside space-y-1">
          {features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
