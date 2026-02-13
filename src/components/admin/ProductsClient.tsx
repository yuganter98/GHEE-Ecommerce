'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Archive, Eye, EyeOff } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    is_active: boolean;
    image_url: string;
}

export function ProductsClient() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        fetch('/api/admin/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) setProducts(data.products);
            })
            .finally(() => setLoading(false));
    };

    const toggleStatus = async (id: number, current: boolean) => {
        try {
            await fetch(`/api/admin/products/${id}/toggle`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !current })
            });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Product Management
                    </h1>
                    <Link
                        href="/admin/products/new"
                        className="px-4 py-2 bg-ghee-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-ghee-700 transition-colors"
                    >
                        <Plus size={16} /> Add Product
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Product</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Stock</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{(product.price / 100).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.stock === 0 ? (
                                                <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">Out of Stock</span>
                                            ) : product.stock <= 5 ? (
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="text-gray-700 font-medium">{product.stock} units</span>
                                                    <span className="text-orange-600 font-bold text-[10px] bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider border border-orange-100">Stock Up</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-700">{product.stock} units</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleStatus(product.id, product.is_active)}
                                                className={`
                                                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all
                                                    ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                                                `}
                                            >
                                                {product.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {product.is_active ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all text-xs font-medium"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            No products found. Start by adding one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
