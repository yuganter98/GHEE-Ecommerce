import { Section } from '@/components/ui/section';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { headers } from 'next/headers';
import { ShopHero } from '@/components/shop/ShopHero';
import { ProductGrid } from '@/components/shop/ProductGrid';

// Force dynamic fetch
export const dynamic = 'force-dynamic';

async function getProducts() {
    const heads = await headers();
    const host = heads.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    try {
        const res = await fetch(`${protocol}://${host}/api/products`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        return await res.json();
    } catch (e) {
        console.error('Fetch error:', e);
        return [];
    }
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Premium Ghee',
    description: 'Buy pure A2 Bilona Ghee online from Kravelab. 100% Organic, Cruelty-Free, and Freshly Made.',
};

export default async function ShopPage() {
    const products = await getProducts();

    return (
        <main className="min-h-screen bg-white">
            <CartDrawer />
            <ShopHero />

            <Section className="py-20 -mt-20 relative z-30">
                <div className="container mx-auto px-4">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-ghee-100/50 backdrop-blur-xl">
                        <ProductGrid products={products} />
                    </div>
                </div>
            </Section>
        </main>
    );
}
