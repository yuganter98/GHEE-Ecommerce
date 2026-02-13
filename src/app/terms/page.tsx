import { Section } from '@/components/ui/section';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white pt-20">
            <Section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-serif font-bold mb-8 text-ghee-900">Terms of Service</h1>
                    <div className="prose prose-lg prose-stone text-gray-600">
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>

                        <h3>1. Introduction</h3>
                        <p>
                            These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, <strong>Kravelab.in</strong>.
                            By using our Website, you accepted these terms and conditions in full.
                        </p>

                        <h3>2. Intellectual Property Rights</h3>
                        <p>
                            Other than the content you own, under these Terms, Kravelab and/or its licensors own all the intellectual property rights and materials contained in this Website.
                            You are granted limited license only for purposes of viewing the material contained on this Website.
                        </p>

                        <h3>3. Restrictions</h3>
                        <p>You are specifically restricted from all of the following:</p>
                        <ul>
                            <li>Publishing any Website material in any other media;</li>
                            <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                            <li>Publicly performing and/or showing any Website material;</li>
                            <li>Using this Website in any way that is or may be damaging to this Website;</li>
                            <li>Using this Website in any way that impacts user access to this Website;</li>
                        </ul>

                        <h3>4. Products and Pricing</h3>
                        <p>
                            All products listed on the website, their descriptions, and their prices are subject to change from time to time on the website.
                            Purchase of a product on the website is subject to availability of stock.
                        </p>

                        <h3>5. Limitation of Liability</h3>
                        <p>
                            In no event shall Kravelab, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.
                        </p>

                        <h3>6. Governing Law & Jurisdiction</h3>
                        <p>
                            These Terms will be governed by and interpreted in accordance with the laws of the State of Rajasthan, India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Rajasthan for the resolution of any disputes.
                        </p>

                        <h3>7. Contact Information</h3>
                        <p>
                            <strong>Email:</strong> kravelabco@gmail.com<br />
                            <strong>Address:</strong> Kravelab Food, Radha Keli Kunj, Village- Dhodhsar, Jaipur Rajasthan 303712
                        </p>
                    </div>
                </div>
            </Section>
        </main>
    );
}
