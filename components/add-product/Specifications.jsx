export default function Specifications({ value, onChange }) {
  return (
    <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
        <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
          Step 4: Technical Specifications
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <input
          name="processor"
          value={value.processor}
          onChange={onChange}
          placeholder="Processor / Chipset"
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
        />
        <input
          name="ram"
          value={value.ram}
          onChange={onChange}
          placeholder="RAM / Memory"
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
        />
        <input
          name="storage"
          value={value.storage}
          onChange={onChange}
          placeholder="Storage"
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
        />
        <input
          name="display"
          value={value.display}
          onChange={onChange}
          placeholder="Display Size"
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
        />
        <textarea
          name="others"
          value={value.others}
          onChange={onChange}
          placeholder="Other specifications"
          rows={3}
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
        />
      </div>
    </div>
  );
}
