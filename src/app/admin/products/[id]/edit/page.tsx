'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProduct(data.product);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!product) return <div className="p-8 text-center text-red-500">Product not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/admin/products" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">
                        Edit Product
                    </h1>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <ProductForm initialData={product} isEdit />
            </main>
        </div>
    );
}
