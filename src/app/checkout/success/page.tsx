'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-ghee-100">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle className="text-green-600 w-12 h-12" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-ghee-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been placed successfully.
            </p>
            {orderId && (
                <div className="bg-gray-50 p-4 rounded-xl mb-8 font-mono text-sm text-gray-500">
                    Order ID: {orderId}
                </div>
            )}
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-ghee-600 text-white rounded-full font-bold hover:bg-ghee-700 transition-colors"
            >
                Continue Shopping <ArrowRight size={18} />
            </Link>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen bg-ghee-50 flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
