import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

interface CheckoutOptions {
    onError?: (error: string) => void;
}

export function useCheckout({ onError }: CheckoutOptions = {}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const { items, clearCart } = useCartStore();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async (payload?: { customer: any, paymentMethod: 'ONLINE' | 'COD' }) => {
        setIsProcessing(true);

        try {
            // 1. Load Script (Only if Online)
            if (!payload || payload.paymentMethod === 'ONLINE') {
                const res = await loadRazorpayScript();
                if (!res) {
                    throw new Error('Razorpay SDK failed to load. Are you online?');
                }
            }

            // 2. Create Order
            // Payload now includes customer & paymentMethod if provided (Phase 4.5)
            // If undefined (CartDrawer quick checkout), it defaults to ONLINE/Guest implicit (Phase 4 legacy support or throw error if strictly enforced)
            const body = {
                items,
                customer: payload?.customer,
                paymentMethod: payload?.paymentMethod || 'ONLINE'
            };

            const orderRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // 3. Handle COD Success
            if (orderData.paymentMethod === 'COD' && orderData.success) {
                clearCart();
                router.push(`/checkout/success?orderId=${orderData.orderId}`);
                return;
            }

            // 4. Open Razorpay (Online)
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Ghee Co.',
                description: 'Premium Bilona Ghee',
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/checkout/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            clearCart();
                            router.push(`/checkout/success?orderId=${orderData.orderId}`);
                        } else {
                            onError?.('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        console.error(err);
                        onError?.('Verification error. Please contact support.');
                    }
                },
                prefill: {
                    name: payload?.customer?.name || 'Guest User',
                    email: payload?.customer?.email || 'guest@example.com',
                    contact: payload?.customer?.phone || '9999999999'
                },
                theme: {
                    color: '#d97706'
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err: any) {
            console.error('Checkout Error:', err);
            onError?.(err.message || 'Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    return { handleCheckout, isProcessing };
}
