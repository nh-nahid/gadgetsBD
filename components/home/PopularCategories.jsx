import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const PopularCategories = () => {
    return (
        <>
              {/* <!-- Popular Categories Section --> */}
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <Link
            href="/products"
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image width={100} height={100}
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200"
                className="h-full object-cover"
                alt="Laptops"
              />
            </div>
            <h3 className="font-medium text-sm">Laptops</h3>
          </Link>
          <Link
            href="/products"
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image
              width={100}
              height={100}
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"
                className="h-full object-cover"
                alt="Smartphones"
              />
            </div>
            <h3 className="font-medium text-sm">Smartphones</h3>
          </Link>
          <Link
            href="/products"
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image
              width={100}
              height={100}
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
                className="h-full object-cover"
                alt="Headphones"
              />
            </div>
            <h3 className="font-medium text-sm">Audio</h3>
          </Link>
          <Link
            href="/products"
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image
              height={100}
              width={100}
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200"
                className="h-full object-cover"
                alt="Gaming"
              />
            </div>
            <h3 className="font-medium text-sm">Gaming</h3>
          </Link>
          <Link
            href="/products"
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image
              width={100}
              height={100}
                src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200"
                className="h-full object-cover"
                alt="Cameras"
              />
            </div>
            <h3 className="font-medium text-sm">Cameras</h3>
          </Link>
          <Link
          width={100}
          height={100}
            href="/products"
            className="bg-white p-4 text-center hover:shadow-md transition-shadow border border-gray-200 rounded"
          >
            <div className="h-32 flex items-center justify-center mb-2">
              <Image
              height={100}
              width={100}
                src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200"
                className="h-full object-cover"
                alt="Wearables"
              />
            </div>
            <h3 className="font-medium text-sm">Wearables</h3>
          </Link>
        </div>
      </div>
        </>
    );
};

export default PopularCategories;