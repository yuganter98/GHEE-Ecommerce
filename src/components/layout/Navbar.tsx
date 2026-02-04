'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Cart Store
    const { items, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch for cart count
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'Story', href: '/about' },
        { name: 'Process', href: '/#process' },
        { name: 'Contact', href: '/contact' },
    ];

    // Check if we are on the home page (transparent header initially) or other pages (white header)
    const isHome = pathname === '/';
    const headerClass = isHome && !isScrolled
        ? 'bg-transparent text-white border-transparent'
        : 'bg-white text-gray-900 border-gray-100 shadow-sm';

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b',
                    headerClass
                )}
            >
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="z-50">
                        <span className={cn("text-2xl font-serif font-bold tracking-tight",
                            isHome && !isScrolled ? "text-white" : "text-ghee-900"
                        )}>
                            Ghee Co.
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-ghee-500",
                                    isHome && !isScrolled ? "text-white/90" : "text-gray-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className={cn(
                                "relative p-2 rounded-full transition-colors",
                                isHome && !isScrolled ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-900"
                            )}
                        >
                            <ShoppingBag size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-ghee-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu size={24} className={isHome && !isScrolled ? "text-white" : "text-gray-900"} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-50 bg-white md:hidden flex flex-col pt-24 px-8"
                    >
                        <button
                            className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>

                        <nav className="flex flex-col gap-6 text-xl font-medium text-gray-900">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
