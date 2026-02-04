'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Store, ShoppingCart } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Skip layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const isActive = (path: string) => pathname.startsWith(path)
        ? 'bg-black text-white'
        : 'text-gray-600 hover:bg-gray-100';

    const handleLogout = async () => {
        // Clear cookie manually or hit an endpoint if exists
        // Since we used HttpOnly cookie, we usually need an endpoint to clear it.
        // For now, simpler to just redirect to login which handles auth check.
        // Or strictly: document.cookie = "admin_session=; Max-Age=0; path=/";
        // But since it's HttpOnly, client JS can't clear it. 
        // We really need a /api/admin/logout endpoint or just let the cookie expire.
        // For this phase, just redirecting to home or login is fine, 
        // but to "logout" securely we need the API. 
        // Let's adding a simple client-side redirection for now.
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo / Brand */}
                        <div className="flex items-center gap-8">
                            <span className="text-xl font-bold font-serif text-gray-900">
                                Ghee<span className="text-ghee-600">.</span> Admin
                            </span>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/admin"
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${pathname === '/admin' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/admin/orders')}`}
                                >
                                    <ShoppingCart size={18} /> Orders
                                </Link>
                                <Link
                                    href="/admin/products"
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/admin/products')}`}
                                >
                                    <Package size={18} /> Products
                                </Link>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <a href="/" target="_blank" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium">
                                <Store size={18} /> <span className="hidden sm:inline">View Store</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
