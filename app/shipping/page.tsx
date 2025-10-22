import Link from 'next/link';

export default function ShippingPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shipping & Delivery
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Fresh nutrition delivered right to your door
          </p>
        </div>
      </section>

      {/* Phase 2 Notice */}
      <section className="bg-[#fff3cd] border-b-4 border-[#ffc107] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center">
            <svg className="h-8 w-8 text-[#856404] mr-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-xl font-semibold text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Online Ordering Coming Soon
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Automated shipping will be available in Phase 2. Currently, please contact us to arrange delivery or pickup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Ordering Process */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How to Order (Phase 1)
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#f8f9fa] rounded-lg p-6 border-2 border-[#e0e0e0]">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Contact Us
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Reach out through our contact form, email, or phone to discuss your order. Let us know your dog's needs and which products you're interested in.
              </p>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6 border-2 border-[#e0e0e0]">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We'll Coordinate
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We'll work with you to arrange the best delivery or pickup option for your location and schedule. Payment and delivery details will be finalized.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#e8f4fb] to-[#f8f9fa] rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Ready to Order?
            </h3>
            <p className="text-[15px] text-[#666666] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Contact us today to place your order for fresh, nutritious meals your dog will love.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Future Shipping Information */}
      <section className="bg-[#f8f9fa] px-4 py-16 border-t-2 border-[#e0e0e0]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Coming in Phase 2: Automated Shipping
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                📦
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Insulated Packaging
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                All fresh meals will be shipped in insulated packaging with ice packs to maintain freshness during transit.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                🚚
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fast Delivery
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Expedited shipping options will ensure your fresh meals arrive quickly and safely at peak freshness.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                🔄
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Subscription Options
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Set up recurring deliveries on your schedule - weekly, bi-weekly, or monthly - so you never run out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping FAQs */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shipping Questions
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-[#a5b5eb] pl-4">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                How will my fresh food stay fresh during shipping?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                When online ordering launches, all fresh meals will be shipped in insulated containers with gel ice packs to maintain proper temperature. We'll use expedited shipping to ensure products arrive within 1-3 days.
              </p>
            </div>

            <div className="border-l-4 border-[#a5b5eb] pl-4">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Do you ship nationwide?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shipping coverage will be announced when our e-commerce platform launches. Contact us to inquire about delivery to your specific location.
              </p>
            </div>

            <div className="border-l-4 border-[#a5b5eb] pl-4">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What if I'm not home when my order arrives?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Our insulated packaging is designed to keep food fresh for several hours after delivery. We recommend refrigerating products as soon as possible after receiving your shipment.
              </p>
            </div>

            <div className="border-l-4 border-[#a5b5eb] pl-4">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Can I track my order?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Yes! When e-commerce launches, you'll receive tracking information via email once your order ships, so you'll know exactly when to expect delivery.
              </p>
            </div>

            <div className="border-l-4 border-[#a5b5eb] pl-4">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What are the shipping costs?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shipping rates will be calculated based on your location and order size. Details will be provided during the checkout process when online ordering is available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Have More Questions?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We're here to help with any questions about ordering, delivery, or our products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              View FAQs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
