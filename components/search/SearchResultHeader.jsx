"use client"

export default function SearchResultsHeader({
  totalResults = 0,
  query = "",
  showingFrom = 1,
  showingTo = 16,
  sort = "featured",
}) {
  return (
    <div className="flex justify-between items-center mb-4 shadow-sm border-b pb-2">
      {/* Results Info */}
      <div className="text-sm">
        <span>
          {showingFrom}-{showingTo} of {totalResults} results for{" "}
        </span>
        <span className="font-bold text-amazon-orange">{`"${query}"`}</span>
      </div>

      
    </div>
  );
}
