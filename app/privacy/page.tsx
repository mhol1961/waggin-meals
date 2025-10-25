import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Privacy Policy
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Your privacy matters to us
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-[#f8f9fa] rounded-lg p-6 mb-8 border-l-4 border-[#a5b5eb]">
            <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-[15px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Introduction
              </h2>
              <p className="mb-4">
                Waggin Meals Pet Nutrition Co. ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information in several ways, including when you place an order, subscribe to our newsletter, fill out forms, or browse our site.
              </p>

              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 mt-4 flex items-center">
                <span className="mr-2">🐾</span> Personal Information
              </h3>
              <p className="mb-3">We may collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping & billing address</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Your dog's name, age, weight, and dietary info (for personalized services)</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 mt-6 flex items-center">
                <span className="mr-2">🐾</span> Automatically Collected Information
              </h3>
              <p className="mb-3">When you visit our site, we may collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device type</li>
                <li>Pages visited</li>
                <li>Time spent on the site</li>
                <li>Referring URL</li>
              </ul>
              <p className="text-sm text-[#666666]">
                This is collected via cookies and analytics tools like Google Analytics.
              </p>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                2. How We Use Your Information
              </h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill orders</li>
                <li>Deliver meals and supplements</li>
                <li>Personalize nutrition recommendations</li>
                <li>Respond to customer service requests</li>
                <li>Send marketing emails (with your consent)</li>
                <li>Improve website performance and user experience</li>
                <li>Detect and prevent fraud or misuse</li>
              </ul>
            </div>

            {/* Sharing Information */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                3. Sharing Your Information
              </h2>
              <p className="mb-4 font-semibold text-[#a5b5eb]">
                We do not sell or rent your personal data.
              </p>
              <p className="mb-3">We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Trusted third parties (e.g., shipping providers, payment processors)</li>
                <li>Service providers who help us operate our website or run promotions</li>
                <li>Legal authorities if required to comply with laws or protect our rights</li>
              </ul>
              <p>
                All third parties we work with are contractually obligated to protect your data.
              </p>
            </div>

            {/* Email Marketing */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                4. Email Marketing & Communication
              </h2>
              <p className="mb-3">
                If you sign up for our newsletter or promotions, we may send you emails about:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>New products</li>
                <li>Feeding tips and nutrition advice</li>
                <li>Special offers and discounts</li>
              </ul>
              <p>
                You can unsubscribe at any time by clicking the link at the bottom of any email, or by contacting us directly.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                5. Cookies and Tracking
              </h2>
              <p className="mb-3">We use cookies to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Understand how visitors use our website</li>
                <li>Improve functionality and content</li>
                <li>Provide personalized experiences</li>
              </ul>
              <p>
                You can disable cookies in your browser settings, but it may affect how our site works for you.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                6. How We Protect Your Data
              </h2>
              <p className="mb-3">We use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>SSL encryption for all website traffic</li>
                <li>Secure payment gateways (we do not store credit card info)</li>
                <li>Access controls for employee accounts</li>
                <li>Routine software updates and security monitoring</li>
              </ul>
              <p>
                Despite our best efforts, no system is 100% secure, so we urge you to protect your passwords and avoid sharing sensitive information via unencrypted means.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                8. Your Data Rights
              </h2>
              <p className="mb-3">
                Depending on where you live, you may have rights to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Request access to the data we have on you</li>
                <li>Correct or update your personal info</li>
                <li>Delete your information (right to be forgotten)</li>
                <li>Opt out of certain data uses</li>
              </ul>
              <p>
                To exercise these rights, contact us at <a href="mailto:info@wagginmeals.com" className="text-[#a5b5eb] hover:text-[#8a9fd9]">info@wagginmeals.com</a>.
              </p>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                9. Third-Party Links
              </h2>
              <p>
                Our site may contain links to third-party sites (e.g., Instagram, payment processors). We are not responsible for the privacy practices of these websites. Please review their policies separately.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                7. Children's Privacy
              </h2>
              <p>
                Our site is not intended for children under 13. We do not knowingly collect data from children. If we learn that a child has submitted information, we will delete it immediately.
              </p>
            </div>

            {/* Policy Updates */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                10. Policy Updates
              </h2>
              <p>
                We may update this Privacy Policy from time to time. If we make material changes, we'll notify you by updating this page and posting the new effective date. Continued use of the site constitutes acceptance of any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-[#e8f4fb] rounded-lg p-6 border-2 border-[#a5b5eb]">
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Contact Us
              </h2>
              <p className="mb-4">
                If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Waggin Meals Pet Nutrition Co.</strong></p>
                <p>Email: <a href="mailto:info@wagginmeals.com" className="text-[#a5b5eb] hover:text-[#8a9fd9]">info@wagginmeals.com</a></p>
                <p className="mt-4">
                  <Link
                    href="/contact"
                    className="inline-block bg-[#a5b5eb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
                  >
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
