export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-6 py-32 max-w-4xl min-h-screen">
            <h1 className="text-4xl font-black tracking-tight mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8 text-slate-300 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing our website, NewsType, you agree to be bound by these Terms of Service and to use the site in accordance with these terms, our Privacy Policy, and any additional terms and conditions that may apply.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                    <p>
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us. News content fetched for typing practice remains the property of the respective publishers (The Guardian, BBC, Google News, etc.) and is presented for non-commercial educational typing practice under fair use concepts.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. User Representations</h2>
                    <p>
                        By using the Site, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                        <li>All registration information you submit will be true, accurate, current, and complete.</li>
                        <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                        <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                        <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Activities</h2>
                    <p>
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. automated scraping, botting, or exploiting the public APIs used for the typing logic is prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. AdSense and Monetization</h2>
                    <p>
                        The platform is ad-supported and uses third party networks such as Google AdSense. By using the platform, you understand and acknowledge that advertisements may be placed around the site experience. Use of adblockers is generally discouraged as ads support the free hosting of the application.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Modifications and Interruptions</h2>
                    <p>
                        We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
                    </p>
                </section>
            </div>
        </div>
    );
}
