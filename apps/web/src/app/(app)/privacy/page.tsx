export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-4xl min-h-screen">
            <h1 className="text-4xl font-black tracking-tight mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-slate-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p>
                        Welcome to NewsType. This Privacy Policy explains how we collect, use,
                        disclose, and safeguard your information when you visit our website.
                        Please read this privacy policy carefully. If you do not agree with the terms
                        of this privacy policy, please do not access the site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Collection of your Information</h2>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect
                        on the Site includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                        <li><strong>Typing Data:</strong> Anonymous statistics regarding your typing speed, accuracy, and practice history.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Use of your Information</h2>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                        <li>Create and manage your account.</li>
                        <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                        <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Advertisers (Google AdSense)</h2>
                    <p>
                        We may use third-party advertising companies, including Google AdSense, to serve ads when you visit the Site. These companies may use information about your visits to the Site and other websites that are contained in web cookies in order to provide advertisements about goods and services of interest to you.
                    </p>
                    <p className="mt-4">
                        Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the advertising cookie enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Ads Settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us.
                    </p>
                </section>
            </div>
        </div>
    );
}
