import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReturnsPage() {
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
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-ghee-900 mb-12 text-center">Returns & Refunds</h1>

                <div className="prose prose-lg text-gray-700 mx-auto space-y-8">
                    <div className="bg-ghee-50 p-6 rounded-2xl border border-ghee-100">
                        <p className="font-medium text-ghee-800">
                            <strong>Note:</strong> As ghee is a consumable food product, we do not accept returns due to hygiene and safety reasons, effectively making all sales final upon delivery.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">1. Eligibility for Refunds</h3>
                        <p>
                            We only offer refunds or replacements under the following specific circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>You received a <strong>damaged or leaking jar</strong>.</li>
                            <li>The product received is <strong>expired</strong> or <strong>incorrect</strong>.</li>
                            <li>The package was lost in transit by our courier partner.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">2. How to Request a Refund</h3>
                        <p>
                            To initiate a refund request, please follow these steps:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mt-2">
                            <li>Take clear photos/videos of the damaged product and packaging.</li>
                            <li>Email us at <strong>kravelabco@gmail.com</strong> or WhatsApp us at <strong>+91 9571259565</strong> within <strong>24 hours</strong> of delivery.</li>
                            <li>Include your Order ID and a brief description of the issue.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">3. Refund Processing</h3>
                        <p>
                            Once your claim is verified, we will initiate a refund to your original payment method within 5-7 business days.
                            For COD orders, we will request your bank details to transfer the refund.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-ghee-800 mb-4">4. Cancellation Policy</h3>
                        <p>
                            You can cancel your order within <strong>2 hours</strong> of placing it or before it has been dispatched, whichever is earlier.
                            Once shipped, orders cannot be cancelled.
                        </p>
                    </div>
                </div>
            </Section>
        </main>
    );
}
