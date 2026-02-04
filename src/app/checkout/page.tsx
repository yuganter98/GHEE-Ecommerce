'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { GuestDetailsForm } from '@/components/checkout/GuestDetailsForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useCheckout } from '@/hooks/useCheckout';

export default function CheckoutPage() {
    const { items, serverTotal } = useCartStore();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');

    // Form State
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '',
        address: { line1: '', city: '', state: '', pincode: '' }
    });
    const [errors, setErrors] = useState<any>({});

    const { handleCheckout, isProcessing } = useCheckout({
        onError: (msg) => alert(msg)
    });

    // Client-side Validation
    const validate = () => {
        const newErrors: any = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Valid phone required';
        if (!formData.address.line1) newErrors['address.line1'] = 'Address required';
        if (!formData.address.city) newErrors['address.city'] = 'City required';
        if (!formData.address.pincode) newErrors['address.pincode'] = 'Pincode required';
        if (!formData.address.state) newErrors['address.state'] = 'State required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);

        // Pass everything to the enhanced handleCheckout
        await handleCheckout({
            customer: formData,
            paymentMethod
        });

        setSubmitting(false);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-ghee-50 flex flex-col items-center justify-center p-4">
                <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
                <Link href="/shop" className="text-ghee-600 underline hover:text-ghee-800">Return to Shop</Link>
            </div>
        );
    }

    const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(p / 100);

    return (
        <main className="min-h-screen bg-ghee-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-ghee-700 mb-8 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Guest & Address Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <GuestDetailsForm formData={formData} setFormData={setFormData} errors={errors} />

                        {/* Payment Method Selection */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-serif font-bold text-ghee-900 border-b pb-4 mb-4">Payment Method</h3>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-ghee-500 bg-ghee-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="pay" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="w-5 h-5 text-ghee-600 accent-ghee-600" />
                                    <div className="ml-4 flex-1">
                                        <span className="block font-bold text-gray-900">Pay Online</span>
                                        <span className="text-sm text-gray-600">UPI, Cards, Netbanking (Secured by Razorpay)</span>
                                    </div>
                                    <Lock size={20} className="text-ghee-600" />
                                </label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-ghee-500 bg-ghee-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="pay" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-5 h-5 text-ghee-600 accent-ghee-600" />
                                    <div className="ml-4 flex-1">
                                        <span className="block font-bold text-gray-900">Cash on Delivery</span>
                                        <span className="text-sm text-gray-600">Pay slightly more for handling</span>
                                    </div>
                                    <Truck size={20} className="text-gray-500" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="text-xl font-serif font-bold text-ghee-900 mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => {
                                    // Find rich details
                                    const details = useCartStore.getState().cartDetails.find((d: any) => d.id === item.id);
                                    const name = details ? details.name : `Product ${item.id}`;
                                    const price = details ? formatPrice(details.price * item.quantity) : '--';

                                    return (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                <span className="font-medium text-gray-900">{name}</span>
                                                <span className="text-xs ml-1">x {item.quantity}</span>
                                            </span>
                                            <span className="font-medium text-gray-900">{price}</span>
                                        </div>
                                    );
                                })}
                                <div className="border-t pt-4 flex justify-between font-bold text-lg text-ghee-900">
                                    <span>Total</span>
                                    <span>{formatPrice(serverTotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={onSubmit}
                                disabled={isProcessing || submitting}
                                className="w-full py-4 bg-ghee-600 text-white rounded-full font-bold hover:bg-ghee-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-ghee-200 transition-all flex justify-center items-center gap-2"
                            >
                                {submitting || isProcessing ? 'Processing...' : (paymentMethod === 'ONLINE' ? 'Pay Securely' : 'Place Order')}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <Lock size={12} /> Secure 256-bit Encrypted Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
