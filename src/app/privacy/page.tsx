import { Section } from '@/components/ui/section';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white pt-20">
            <Section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-serif font-bold mb-8 text-ghee-900">Privacy Policy</h1>
                    <div className="prose prose-lg prose-stone text-gray-600">
                        <p>Last Updated: {new Date().toLocaleDateString()}</p>

                        <h3>1. Introduction</h3>
                        <p>
                            Welcome to <strong>Kravelab.in</strong>. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you as to how we look after your personal data when you visit our website directly or via our partner sites.
                        </p>

                        <h3>2. Data We Collect</h3>
                        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                        <ul>
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                        </ul>

                        <h3>3. How We Use Your Data</h3>
                        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul>
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering your ghee).</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>

                        <h3>4. Data Security</h3>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                            In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>

                        <h3>5. Contact Us</h3>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:<br />
                            <strong>Email:</strong> kravelabco@gmail.com<br />
                            <strong>Address:</strong> Kravelab Food, Radha Keli Kunj, Village- Dhodhsar, Jaipur Rajasthan 303712
                        </p>
                    </div>
                </div>
            </Section>
        </main>
    );
}
