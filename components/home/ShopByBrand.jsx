import React from 'react';

const ShopByBrand = () => {
    return (
        <>
            {/* <!-- Shop by Brand Section --> */}
      <div className="bg-white py-8 mt-8">
        <div className="max-w-[1500px] mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Brand</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Apple</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Samsung</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Dell</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >HP</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Lenovo</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Sony</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Razer</span>

            </div>
            <div
              className="flex-none w-32 h-32 bg-gray-50 border border-gray-200 rounded flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-2xl font-bold text-gray-400"
              >Logitech</span>

            </div>
          </div>
        </div>
      </div>
        </>
    );
};

export default ShopByBrand;