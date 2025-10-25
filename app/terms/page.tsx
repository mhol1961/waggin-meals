import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Terms of Service
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Terms and conditions for using our services
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-[#f8f9fa] rounded-lg p-6 mb-8 border-l-4 border-[#a5b5eb]">
            <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-[15px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>

            {/* About Us */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                1. About Us
              </h2>
              <p>
                Waggin Meals Nutrition Co. provides human-grade, FDA-approved food for dogs that's lovingly formulated by our founder, Christie. We believe in transparency, whole ingredients, and nutrition backed by real science—not fillers or fluff.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                2. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By browsing our website, creating an account, or placing an order, you agree to these Terms and our Privacy Policy. If you're using our site on behalf of someone else (like ordering for a pet), you affirm you have their permission.
              </p>
            </div>

            {/* Products and Services */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                3. Products and Services
              </h2>
              <p className="mb-4">Our products are:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Human-grade dog food</li>
                <li>Nutritional supplements for dogs</li>
                <li>Subscription meal plans</li>
                <li>Personalized feeding recommendations</li>
              </ul>
              <p className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
                <strong>Important:</strong> Our products are not intended to diagnose, treat, cure, or prevent any disease. The content on our site is for informational purposes only and is not a substitute for veterinary advice.
              </p>
            </div>

            {/* Use of Services */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                4. Use of Our Services
              </h2>
              <p className="mb-3">
                You may use our services only in compliance with these Terms and all applicable laws. You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon or violate our intellectual property rights or the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Upload viruses or other malicious code</li>
                <li>Spam, solicit, or harm any individual</li>
                <li>Collect or harvest any information from our services without permission</li>
                <li>Interfere with or disrupt our services or servers</li>
              </ul>
            </div>

            {/* Account Registration */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                5. Account Registration
              </h2>
              <p className="mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                You agree to immediately notify us of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your account information.
              </p>
            </div>

            {/* Products and Services */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Products and Services
              </h2>

              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 mt-4">
                Product Descriptions
              </h3>
              <p className="mb-4">
                We make every effort to accurately describe our products and services. However, we do not warrant that product descriptions, images, or other content on our website are accurate, complete, reliable, current, or error-free.
              </p>

              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 mt-4">
                Pricing
              </h3>
              <p className="mb-4">
                All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. We are not liable to you or any third party for any price changes, modifications, or discontinuation of products.
              </p>

              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 mt-4">
                Orders and Payment
              </h3>
              <p className="mb-3">
                We reserve the right to refuse or cancel any order for any reason, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Product availability</li>
                <li>Errors in product or pricing information</li>
                <li>Suspected fraudulent or unauthorized transactions</li>
              </ul>
              <p>
                Payment must be received before orders are processed. We accept various payment methods as indicated during checkout. All payments are processed through secure third-party payment processors.
              </p>
            </div>

            {/* Nutrition Consultations */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Nutrition Consultations
              </h2>
              <p className="mb-4">
                Our nutrition consultation services are provided for informational and educational purposes. While our nutritionist is certified and experienced, our services do not replace professional veterinary care.
              </p>
              <p className="mb-4">
                You should always consult with your veterinarian before making significant changes to your dog's diet, especially if your dog has existing health conditions. We are not liable for any health issues that may arise from following our nutritional recommendations.
              </p>
              <p>
                Consultation fees are non-refundable once the consultation has been completed.
              </p>
            </div>

            {/* Shipping and Delivery */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Shipping and Delivery
              </h2>
              <p className="mb-4">
                We make every effort to ensure timely delivery of our products. However, we are not responsible for delays caused by shipping carriers, weather conditions, or other circumstances beyond our control.
              </p>
              <p className="mb-4">
                Risk of loss and title for products pass to you upon delivery to the shipping carrier. You are responsible for inspecting products upon receipt and reporting any damage or defects within 48 hours of delivery.
              </p>
              <p>
                For perishable products, please refrigerate immediately upon receipt. We are not responsible for product quality issues resulting from improper storage or delayed refrigeration after delivery.
              </p>
            </div>

            {/* Returns and Refunds */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Returns and Refunds
              </h2>
              <p className="mb-4">
                Due to the perishable nature of our products, returns are handled on a case-by-case basis. If you are unsatisfied with your purchase, please contact us within 14 days of delivery to discuss a potential refund or exchange.
              </p>
              <p className="mb-4">
                To be eligible for a refund, products must be unused and in their original packaging. Perishable products that have been opened or improperly stored may not be eligible for refund.
              </p>
              <p>
                Refunds will be processed to the original payment method within 7-10 business days after approval. Shipping costs are non-refundable unless the return is due to our error.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Intellectual Property
              </h2>
              <p className="mb-4">
                All content on our website, including text, graphics, logos, images, recipes, and software, is the property of Waggin Meals Pet Nutrition Co. and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use our content without our express written permission.
              </p>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Disclaimer of Warranties
              </h2>
              <p className="mb-4">
                OUR SERVICES AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that our services will be uninterrupted, error-free, or completely secure. We do not guarantee any specific results from using our products or services.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Limitation of Liability
              </h2>
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WAGGIN MEALS PET NUTRITION CO. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p>
                Our total liability to you for any claims arising from your use of our services or products shall not exceed the amount you paid to us in the twelve (12) months prior to the claim.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Waggin Meals Pet Nutrition Co., its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including legal fees, arising from your use of our services, violation of these Terms, or infringement of any rights of another party.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Waggin Meals Pet Nutrition Co. operates, without regard to its conflict of law provisions.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Dispute Resolution
              </h2>
              <p className="mb-4">
                Any dispute arising from these Terms or your use of our services shall first be resolved through good faith negotiations. If the dispute cannot be resolved through negotiation, it shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Changes to These Terms
              </h2>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.
              </p>
              <p>
                Your continued use of our services after any changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you must stop using our services.
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Severability
              </h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-[#e8f4fb] rounded-lg p-6 border-2 border-[#a5b5eb]">
              <h2 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Contact Us
              </h2>
              <p className="mb-4">
                If you have questions about these Terms of Service, please contact us:
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
