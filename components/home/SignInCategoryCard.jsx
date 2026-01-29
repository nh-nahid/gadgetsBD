"use client"

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SignInCategoryCard = () => {
    return (
        <div
            className="bg-white p-4 flex flex-col gap-4 shadow-sm z-20 justify-between"
          >
            <div className="shrink-0">
              <h2 className="text-xl font-bold">
                Sign in for the best tech deals
              </h2>
              <Link href="/login"
                className="bg-amazon-yellow w-full py-2 justify-center items-center flex rounded-md shadow-sm mt-4 text-sm hover:bg-amazon-yellow_hover"
              >
                Sign in securely
              </Link>
            </div>
            <div className="mt-4 grow h-full">
              <Image width={100} height={100} alt='image'
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
    );
};

export default SignInCategoryCard;