'use client';

import Image from 'next/image';

import { useCartStore } from '@/store/cart';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCheckout } from '@/hooks/useCheckout';

import { useRouter } from 'next/navigation';

export function CartDrawer() {
    const router = useRouter();
    const {
        isCartOpen, closeCart, items, cartDetails, serverTotal,
        updateQuantity, removeItem, warnings, validateCart
    } = useCartStore();


    // Hydration fix
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        useCartStore.persist.rehydrate();
        setMounted(true);
        validateCart(); // Validate on mount
    }, [validateCart]);

    if (!mounted) return null;

    const formatPrice = (p: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(p / 100);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-ghee-50">
                            <h2 className="font-serif text-2xl font-bold text-ghee-900 flex items-center gap-2">
                                <ShoppingBag className="text-ghee-600" /> Cart ({items.length})
                            </h2>
                            <button onClick={closeCart} className="p-2 hover:bg-white rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {warnings.length > 0 && (
                                <div className="p-3 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200">
                                    {warnings.map((w, i) => <p key={i}>⚠️ {w}</p>)}
                                </div>
                            )}

                            {items.length === 0 ? (
                                <div className="text-center text-gray-400 mt-20">
                                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Your cart is empty.</p>
                                </div>
                            ) : (
                                items.map((item) => {
                                    const details = cartDetails.find(d => d.id === item.id);
                                    return (
                                        <div key={item.id} className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                                {details?.image_url ? (
                                                    <Image
                                                        src={details.image_url}
                                                        alt={details.name || `Product ${item.id}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-gray-500">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                                                    {details ? details.name : `Product ID: ${item.id}`}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Minus size={14} /></button>
                                                    <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Plus size={14} /></button>
                                                    <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-ghee-50/50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-600">Total</span>
                                <span className="text-2xl font-serif font-bold text-ghee-900">{formatPrice(serverTotal)}</span>
                            </div>
                            <button
                                onClick={() => {
                                    closeCart();
                                    router.push('/checkout');
                                }}
                                disabled={items.length === 0}
                                className="w-full py-4 bg-ghee-600 text-white rounded-full font-bold hover:bg-ghee-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ghee-200 transition-all flex justify-center items-center gap-2"
                            >
                                Proceed to Checkout
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                Calculated secure server-side totals.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
