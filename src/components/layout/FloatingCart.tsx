'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingCart() {
    const { items, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => setMounted(true), []);

    const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-4 bg-black text-white rounded-full shadow-2xl shadow-black/30 hover:shadow-black/50 transition-shadow group flex items-center justify-center"
        >
            <ShoppingBag size={24} className="group-hover:text-ghee-300 transition-colors" />

            <AnimatePresence>
                {cartCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-ghee-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
                    >
                        {cartCount}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hover Tooltip/Label */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: -20 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-full whitespace-nowrap bg-white text-black px-3 py-1.5 rounded-lg text-sm font-medium shadow-xl border border-gray-100"
                    >
                        View Cart
                        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white rotate-45 -translate-y-1/2" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
