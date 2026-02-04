'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface Order {
    id: number;
    razorpay_order_id: string;
    amount: number;
    status: string;
    customer_details: {
        name: string;
        email?: string;
    };
    created_at: string;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.orders);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'COD_PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-gray-100 text-gray-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PAID': return <CheckCircle size={14} />;
            case 'COD_PENDING': return <Clock size={14} />;
            case 'SHIPPED': return <Truck size={14} />;
            case 'DELIVERED': return <Package size={14} />;
            default: return null;
        }
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Admin Dashboard
                    </h1>
                    <div className="text-sm text-gray-500">
                        {orders.length} total orders
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Order ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-500">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customer_details?.name || 'Guest'}</div>
                                            <div className="text-gray-400 text-xs">{order.customer_details?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{(order.amount / 100).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-ghee-600 hover:border-ghee-200 hover:shadow-sm transition-all text-xs font-medium"
                                            >
                                                <Eye size={14} /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
