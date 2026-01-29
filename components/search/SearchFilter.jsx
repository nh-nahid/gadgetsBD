import { Search } from 'lucide-react';
import React from 'react';

const SearchFilter = () => {
    return (
        <>
            {/* Search */}
        <div className="flex-1 flex h-10 rounded-md overflow-hidden focus-within:ring-3 focus-within:ring-amazon-secondary">
          <select className="bg-gray-100 text-black text-xs px-2 border-r border-gray-300 cursor-pointer hover:bg-gray-200">
            <option>All</option>
            <option>Laptops</option>
            <option>Phones</option>
            <option>Accessories</option>
            <option>Gaming</option>
          </select>
          <input
            type="text"
            placeholder="Search Gadgets, Laptops, Phones..."
            className="flex-1 px-3 text-black outline-none"
          />
          <button className="bg-amazon-secondary hover:bg-[#fa8900] px-4 flex items-center justify-center">
            <Search className="text-black w-5 h-5" />
          </button>
        </div>
        </>
    );
};

export default SearchFilter;