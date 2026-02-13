import { db } from '@/lib/db';
import Link from 'next/link';
import {
    TrendingUp,
    Package,
    ShoppingCart,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
    const client = await db.connect();
    try {
        // Parallelize queries for performance
        const [
            ordersRes,
            revenueRes,
            productsRes,
            lowStockRes,
            recentOrdersRes
        ] = await Promise.all([
            client.query(`SELECT COUNT(*) FROM orders`),
            client.query(`SELECT SUM(amount) FROM orders WHERE status IN ('PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED')`),
            client.query(`SELECT COUNT(*) FROM products WHERE is_active = true`),
            client.query(`SELECT COUNT(*) FROM products WHERE stock <= 5`),
            client.query(`
                SELECT o.id, o.amount, o.status, o.created_at, o.customer_details->>'name' as customer_name 
                FROM orders o 
                ORDER BY created_at DESC 
                LIMIT 5
            `)
        ]);

        return {
            totalOrders: parseInt(ordersRes.rows[0].count),
            totalRevenue: parseInt(revenueRes.rows[0].sum || '0'),
            activeProducts: parseInt(productsRes.rows[0].count),
            lowStockCount: parseInt(lowStockRes.rows[0].count),
            recentOrders: recentOrdersRes.rows
        };
    } finally {
        client.release();
    }
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    // Defense in Depth: Verify session at page level
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'true') {
        redirect('/admin/login');
    }

    const stats = await getStats();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount / 100);
    };

    return (
        <main className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-ghee-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your store's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={<TrendingUp size={24} className="text-green-600" />}
                    bg="bg-green-50"
                    trend="+12% from last month"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingCart size={24} className="text-blue-600" />}
                    bg="bg-blue-50"
                />
                <StatsCard
                    title="Active Products"
                    value={stats.activeProducts}
                    icon={<Package size={24} className="text-ghee-600" />}
                    bg="bg-ghee-50"
                />
                <StatsCard
                    title="Low Stock Alerts"
                    value={stats.lowStockCount}
                    icon={<AlertTriangle size={24} className="text-orange-600" />}
                    bg="bg-orange-50"
                    alert={stats.lowStockCount > 0}
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-ghee-600 font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats.recentOrders.map((order: any) => (
                            <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.customer_name || 'Guest Customer'}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {stats.recentOrders.length === 0 && (
                            <div className="p-8 text-center text-gray-400">No orders yet.</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions (Placeholder) */}
                <div className="bg-ghee-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ghee-700/20 rounded-full blur-3xl -mr-8 -mt-8" />
                    <div className="relative z-10">
                        <h2 className="text-xl font-serif font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/admin/products/new" className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium border border-white/10 backdrop-blur-sm">
                                + Add New Product
                            </Link>
                            <Link href="/shop" target="_blank" className="block w-full text-center py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-medium border border-white/5 backdrop-blur-sm">
                                View Live Store
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatsCard({ title, value, icon, bg, trend, alert }: any) {
    return (
        <div className={`rounded-2xl p-6 border ${alert ? 'border-orange-200 bg-orange-50/50' : 'border-gray-100 bg-white'} shadow-sm flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
                    {icon}
                </div>
                {alert && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
                {trend && <p className="text-xs text-green-600 font-medium mt-2">{trend}</p>}
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'PAID': return 'bg-green-100 text-green-700';
        case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
        case 'SHIPPED': return 'bg-purple-100 text-purple-700';
        case 'DELIVERED': return 'bg-gray-100 text-gray-700';
        case 'CANCELLED': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
    }
}
