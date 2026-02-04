'use client';

import { motion, Variants } from 'framer-motion';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: any[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
};

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500">No products found at the moment.</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {products.map((p) => (
                <motion.div key={p.id} variants={item} className="h-full">
                    <ProductCard product={p} />
                </motion.div>
            ))}
        </motion.div>
    );
}
