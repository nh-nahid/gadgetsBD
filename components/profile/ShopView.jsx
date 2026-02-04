import Image from "next/image";

export default function ShopView({ shop }) {
    return (
        <div className="space-y-6">
            {/* Shop Card Preview */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-300 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Shop Preview
                    </h2>
                    <span className="flex items-center bg-green-50 px-2 py-1 rounded border border-green-200">
                        <i
                            data-lucide="check-circle"
                            className="w-3 h-3 text-green-600 mr-1"
                        ></i>
                        <span className="text-[10px] font-bold text-green-700 uppercase">
                            Verified
                        </span>
                    </span>
                </div>

                <div className="p-6">
                    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-sm overflow-hidden shadow-md">
                        <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                            <Image
                                src={shop.coverImage }
                                alt="Shop Banner"
                                width={1200}           
                                height={400}          
                                className="w-full h-full object-cover"
                            />

                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-amazon-blue mb-1">
                                {shop.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                                {shop.location.city}, {shop.location.country}
                            </p>
                            <div className="flex items-center gap-1 mb-3">
                                <div className="flex text-amazon-secondary">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <i key={i} data-lucide="star" className="w-4 h-4 fill-current"></i>
                                    ))}
                                </div>
                                <span className="text-xs text-amazon-blue">
                                    {shop.rating.count} ratings
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">{shop.description}</p>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-xs">
                                    <span className="text-gray-500">Specializes in:</span>{" "}
                                    <span className="font-bold">{shop.specializesIn.join(", ")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Details */}
            <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-300">
                    <h2 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                        Shop Information
                    </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Shop Name", value: shop.name },
                        { label: "Owner Name", value: shop.ownerName },
                        { label: "Email", value: shop.email },
                        { label: "Phone Number", value: shop.phone },
                        { label: "Location", value: `${shop.location.city}, ${shop.location.country}` },
                        { label: "Specialization", value: shop.specializesIn.join(", ") },
                        { label: "Shop Description", value: shop.description, span: 2 },
                        { label: "Address", value: shop.address, span: 2 },
                        { label: "Year Established", value: shop.yearEstablished },
                        { label: "Employees", value: shop.employees },
                        { label: "Brands", value: shop.brands.join(", "), span: 2 },
                        { label: "Website", value: shop.website, span: 2 },
                    ].map((item, idx) => (
                        <div key={idx} className={item.span ? `md:col-span-${item.span}` : ""}>
                            <label className="block text-xs text-gray-500 mb-1">{item.label}</label>
                            <p className="font-medium">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
