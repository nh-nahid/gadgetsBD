import Link from 'next/link';
import React from 'react';

const Logo = () => {
    return (
         <>
            {/* <!-- Logo --> */}
            <div className="mb-4">
                <Link href={'/'} className="flex items-center">
                    <span className="text-3xl font-bold tracking-tighter text-black"
                    >gadgets<span className="italic text-amazon-secondary"
                    >BD</span></span>


                </Link>
            </div>
         </>
    );
};

export default Logo;