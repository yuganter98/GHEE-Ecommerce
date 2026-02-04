import { ProductForm } from '@/components/admin/ProductForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/admin/products" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">
                        Add New Product
                    </h1>
                </div>
            </header>
            <main className="container mx-auto px-6 py-8">
                <ProductForm />
            </main>
        </div>
    );
}
