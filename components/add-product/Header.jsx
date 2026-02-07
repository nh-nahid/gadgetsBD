import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Header() {
    return (
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-normal">Add a Product</h1>
                <p className="text-sm text-gray-600">
                    Create a new listing for your gadget product.
                </p>
            </div>

            <Link
                href="/manage-products"
                className="text-amazon-blue hover:underline text-sm flex items-center gap-1"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Manage List
            </Link>
        </div>
    );
}
