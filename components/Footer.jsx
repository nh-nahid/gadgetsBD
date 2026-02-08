"use client"

import Link from 'next/link';
import React from 'react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', 
        });
    };

    return (
        <footer className="bg-amazon-light text-white mt-8">
           
            <div
                onClick={scrollToTop}
                className="bg-[#37475A] py-4 text-center hover:bg-[#485769] transition cursor-pointer"
            >
                <span className="text-sm font-medium">Back to top</span>
            </div>

            <div className="max-w-[1000px] mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <h3 className="font-bold mb-4">Get to Know Us</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link href="#" className="hover:underline">About Gadgets BD</Link></li>
                        <li><Link href="#" className="hover:underline">Careers</Link></li>
                        <li><Link href="/shops" className="hover:underline">Our Top Brands</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Make Money with Us</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link href="#" className="hover:underline">Sell on Gadgets BD</Link></li>
                        <li><Link href="#" className="hover:underline">Supply to Gadgets BD</Link></li>
                        <li><Link href="#" className="hover:underline">Become an Affiliate</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Payment Products</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link href="#" className="hover:underline">Gadgets BD Business Card</Link></li>
                        <li><Link href="#" className="hover:underline">Shop with Points</Link></li>
                        <li><Link href="#" className="hover:underline">Reload Your Balance</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4">Let Us Help You</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link href="#" className="hover:underline">Your Account</Link></li>
                        <li><Link href="/orders" className="hover:underline">Your Orders</Link></li>
                        <li><Link href="#" className="hover:underline">Shipping Rates & Policies</Link></li>
                        <li><Link href="#" className="hover:underline">Returns & Replacements</Link></li>
                        <li><Link href="#" className="hover:underline">Manage Your Content and Devices</Link></li>
                        <li><Link href="#" className="hover:underline">Help</Link></li>
                    </ul>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-gray-600 text-center py-8">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <span className="text-2xl font-bold tracking-tighter">
                        gadgets<span className="italic text-gray-400">BD</span>
                    </span>
                </div>
                <p className="text-xs text-gray-400">
                    &copy; 2025 Gadgets BD - Premium Tech Marketplace. All rights reserved by LWS.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
