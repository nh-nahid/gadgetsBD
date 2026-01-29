// components/SearchResultsHeader.jsx
export default function SearchResultsHeader({ totalResults = 0, query = "", showingFrom = 1, showingTo = 16 }) {
  return (
    <div className="flex justify-between items-center mb-4 shadow-sm border-b pb-2">
      {/* Results Info */}
      <div className="text-sm">
        <span>
          {showingFrom}-{showingTo} of {totalResults} results for{" "}
        </span>
        <span className="font-bold text-amazon-orange">{`"${query}"`}</span>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Sort by:</span>
        <select className="text-sm bg-gray-100 border border-gray-300 rounded px-2 py-1 shadow-sm focus:ring-1 focus:ring-amazon-secondary focus:border-amazon-secondary">
          <option>Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Avg. Customer Review</option>
          <option>Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
}
