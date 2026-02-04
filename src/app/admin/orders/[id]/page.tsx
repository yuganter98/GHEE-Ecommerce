'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Box, Check, Truck, X, Phone, MapPin, Mail, CreditCard, Calendar } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
    image_url: string;
}

interface Order {
    id: number;
    status: string;
    amount: number;
    razorpay_order_id: string;
    payment_method?: string;
    tracking_id?: string;
    created_at: string;
    shipped_at?: string;
    delivered_at?: string;
    customer_details: {
        name: string;
        phone: string;
        email?: string;
        address: {
            line1: string;
            city: string;
            state: string;
            pincode: string;
        };
    };
    items: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [trackingInput, setTrackingInput] = useState('');
    const [showShipModal, setShowShipModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                alert('Failed to load order');
                router.push('/admin/orders');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string, extraData: any = {}) => {
        if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, ...extraData })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            await fetchOrder(); // Reload data
            setShowShipModal(false);
        } catch (err: any) {
            alert(err.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const canCancel = ['COD_PENDING', 'PAID', 'CONFIRMED'].includes(order.status);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/admin/orders" className="text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">
                        Order #{order.id}
                    </h1>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700`}>
                        {order.status.replace('_', ' ')}
                    </span>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Order Info & Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-700 flex justify-between">
                                <span>Items</span>
                                <span>{order.items.length} items</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            ₹{((item.price_at_purchase * item.quantity) / 100).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span className="text-lg">₹{(order.amount / 100).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-700">Customer Details</div>
                            <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Check size={16} /></div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customer_details?.name}</p>
                                            <p className="text-gray-500">Customer Name</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><Phone size={16} /></div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customer_details?.phone}</p>
                                            <p className="text-gray-500">Contact Number</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Mail size={16} /></div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customer_details?.email || 'N/A'}</p>
                                            <p className="text-gray-500">Email Address</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0"><MapPin size={16} /></div>
                                    <div>
                                        <p className="font-medium text-gray-900 leading-relaxed">
                                            {order.customer_details?.address?.line1}<br />
                                            {order.customer_details?.address?.city}, {order.customer_details?.address?.state}<br />
                                            {order.customer_details?.address?.pincode}
                                        </p>
                                        <p className="text-gray-500 mt-1">Shipping Address</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Timeline */}
                    <div className="space-y-6">

                        {/* Status Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="font-semibold text-gray-700 mb-4">Update Status</h2>

                            <div className="space-y-3">
                                {(order.status === 'COD_PENDING' || order.status === 'PAID') && (
                                    <button
                                        onClick={() => updateStatus('CONFIRMED')}
                                        disabled={updating}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} /> Confirm Order
                                    </button>
                                )}

                                {order.status === 'CONFIRMED' && (
                                    <button
                                        onClick={() => setShowShipModal(true)}
                                        disabled={updating}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Truck size={18} /> Mark as Shipped
                                    </button>
                                )}

                                {order.status === 'SHIPPED' && (
                                    <button
                                        onClick={() => updateStatus('DELIVERED')}
                                        disabled={updating}
                                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Box size={18} /> Mark Delivered
                                    </button>
                                )}

                                {canCancel && (
                                    <button
                                        onClick={() => updateStatus('CANCELLED')}
                                        disabled={updating}
                                        className="w-full py-3 border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                                    >
                                        <X size={18} /> Cancel Order
                                    </button>
                                )}

                                {order.status === 'DELIVERED' && (
                                    <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center font-medium">
                                        Order Completed
                                    </div>
                                )}
                                {order.status === 'CANCELLED' && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium">
                                        Order Cancelled
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 text-sm">
                            <h3 className="font-semibold text-gray-700">Order Information</h3>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500 flex items-center gap-2"><CreditCard size={14} /> Method</span>
                                <span className="font-medium text-gray-900">{order.payment_method || 'Online'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Date</span>
                                <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-500">Razorpay ID</span>
                                <span className="font-mono text-xs bg-gray-100 p-1 rounded">{order.razorpay_order_id}</span>
                            </div>
                            {order.tracking_id && (
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-gray-500">Tracking ID</span>
                                    <span className="font-mono font-medium text-purple-600">{order.tracking_id}</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            {/* Shipping Modal */}
            {showShipModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Enter Tracking Details</h3>
                        <p className="text-sm text-gray-600 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">Please provide the tracking number for this shipment.</p>

                        <input
                            type="text"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-4 focus:ring-2 focus:ring-ghee-500 outline-none"
                            placeholder="Tracking ID / AWB Number"
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowShipModal(false)}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateStatus('SHIPPED', { tracking_id: trackingInput })}
                                disabled={!trackingInput.trim() || updating}
                                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
                            >
                                Confirm Shipment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
