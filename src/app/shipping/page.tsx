import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ShippingPage() {
    return (
        <main className="bg-white min-h-screen pt-20 pb-20 relative">
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-ghee-900/80 hover:text-ghee-900 transition-colors group">
                    <div className="p-2 rounded-full bg-ghee-900/5 backdrop-blur-md group-hover:bg-ghee-900/10 transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>
            </div>
            <Section className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-ghee-900 mb-12 text-center">Shipping Policy</h1>

                <div className="prose prose-lg text-gray-700 mx-auto space-y-8">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">1. Order Processing</h3>
                        <p>
                            We strive to process all orders within <strong>24-48 hours</strong> of placement.
                            Orders placed on weekends or public holidays will be processed on the next business day.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">2. Delivery Timelines</h3>
                        <p>
                            Once shipped, you can expect your delivery within:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Metro Cities:</strong> 2-4 business days</li>
                            <li><strong>Rest of India:</strong> 5–7 business days</li>
                            <li><strong>Remote Areas:</strong> 7–10 business days</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">3. Shipping Charges</h3>
                        <p>
                            We offer <strong>Free Shipping</strong> on all orders above ₹999.
                            For orders below this amount, a standard shipping fee of ₹50 applies.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">4. Tracking Your Order</h3>
                        <p>
                            Once your order is dispatched, you will receive an email and SMS with a tracking ID and link to track your package in real-time.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">5. Damaged Items</h3>
                        <p>
                            We take great care in packaging our glass jars. However, if you receive a damaged product, please contact us within 24 hours of delivery at support@kravelab.in with photos of the damaged package.
                        </p>
                    </div>
                </div>
            </Section>
        </main>
    );
}
