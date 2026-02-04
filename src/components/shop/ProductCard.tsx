'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { Plus, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
}

export function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore(state => state.addItem);

    // Format currency
    const formatPrice = (p: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(p / 100);
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-white/40 backdrop-blur-md rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-ghee-200/50 transition-all duration-500 border border-white/50 flex flex-col h-full"
        >
            {/* Image Area */}
            <div className="relative aspect-[4/4] w-full p-8 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/60 to-transparent">
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-ghee-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transform">
                    <Star size={12} className="fill-ghee-400 text-ghee-400" /> 4.9
                </div>

                <div className="absolute inset-0 bg-ghee-100/20 rounded-full blur-3xl scale-0 group-hover:scale-150 transition-transform duration-700" />

                <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-700 ease-[0.2,0,0,1] drop-shadow-lg group-hover:drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 300px"
                />

                {/* Quick Add Overlay on Desktop */}
                <div className="absolute bottom-6 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden md:flex">
                    <button
                        onClick={() => addItem(product.id)}
                        disabled={product.stock === 0}
                        className="bg-ghee-950 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-ghee-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ghee-950 disabled:hover:scale-100 disabled:shadow-none"
                    >
                        <ShoppingCart size={18} /> {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                </div>

                {/* Low Stock Badge */}
                {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-4 left-4 z-10 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-red-200 animate-pulse">
                        Few in stock left
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-8 flex flex-col flex-1 bg-white/30 backdrop-blur-sm">
                <div className="mb-4">
                    <h3 className="font-serif text-2xl font-bold text-ghee-950 mb-3 leading-tight group-hover:text-ghee-700 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-light">
                        {product.description}
                    </p>
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-ghee-100/50 pt-6">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-ghee-900 font-serif">{formatPrice(product.price)}</span>
                    </div>

                    {/* Mobile Only Add Button */}
                    <button
                        onClick={() => addItem(product.id)}
                        disabled={product.stock === 0}
                        className="md:hidden w-12 h-12 bg-ghee-950 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {product.stock > 0 ? <Plus size={24} /> : <span className="text-[10px] font-bold">SOLD</span>}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
