import Link from 'next/link';
import { Package, Truck, MapPin, Clock, DollarSign, Heart } from 'lucide-react';

export default function ShippingPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shipping & Delivery
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Fresh, nutritious meals delivered right to your door with care
          </p>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="bg-[#F8F5F0] px-4 py-8 border-b-2 border-[#e0e0e0]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-[#8FAE8F] rounded-full px-8 py-4 shadow-lg">
            <Package className="w-8 h-8 text-[#8FAE8F]" />
            <div className="text-left">
              <p className="text-2xl font-bold text-[#8FAE8F]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                FREE SHIPPING
              </p>
              <p className="text-sm text-[#333333]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                On orders $165 or more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How We Ship
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Standard Shipping */}
            <div className="bg-[#f8f9fa] rounded-xl p-6 border-2 border-[#e0e0e0] hover:border-[#8FAE8F] transition-colors">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Standard Shipping
              </h3>
              <p className="text-[14px] text-[#666666] mb-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                FedEx Ground delivery to your door
              </p>
              <ul className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#8FAE8F] mt-0.5">✓</span>
                  <span>FREE on orders $165+</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8FAE8F] mt-0.5">✓</span>
                  <span>Insulated packaging with ice packs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8FAE8F] mt-0.5">✓</span>
                  <span>1-5 business days depending on zone</span>
                </li>
              </ul>
            </div>

            {/* Local Delivery */}
            <div className="bg-[#f8f9fa] rounded-xl p-6 border-2 border-[#e0e0e0] hover:border-[#5E8C8C] transition-colors">
              <div className="w-16 h-16 bg-[#5E8C8C] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Local Delivery
              </h3>
              <p className="text-[14px] text-[#666666] mb-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                FREE delivery in Asheville area
              </p>
              <ul className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#5E8C8C] mt-0.5">✓</span>
                  <span>Always FREE for local customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5E8C8C] mt-0.5">✓</span>
                  <span>1-2 business day delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5E8C8C] mt-0.5">✓</span>
                  <span>Personal service from our team</span>
                </li>
              </ul>
            </div>

            {/* Local Pickup */}
            <div className="bg-[#f8f9fa] rounded-xl p-6 border-2 border-[#e0e0e0] hover:border-[#C97B63] transition-colors">
              <div className="w-16 h-16 bg-[#C97B63] rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Local Pickup
              </h3>
              <p className="text-[14px] text-[#666666] mb-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Pick up from our kitchen
              </p>
              <ul className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#C97B63] mt-0.5">✓</span>
                  <span>Always FREE</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C97B63] mt-0.5">✓</span>
                  <span>Same-day or next-day available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C97B63] mt-0.5">✓</span>
                  <span>Meet our team in person</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Zones & Rates */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shipping Zones & Rates
          </h2>
          <p className="text-center text-[#666666] mb-10 max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We ship fresh meals nationwide using FedEx Ground. Rates are calculated based on your location and order weight.
          </p>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#8FAE8F] text-white">
                    <th className="px-6 py-4 text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>Zone</th>
                    <th className="px-6 py-4 text-left" style={{ fontFamily: "'Poppins', sans-serif" }}>States</th>
                    <th className="px-6 py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Base Rate</th>
                    <th className="px-6 py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Per Pound</th>
                    <th className="px-6 py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Local */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="px-6 py-4 font-semibold text-[#8FAE8F]" style={{ fontFamily: "'Poppins', sans-serif" }}>Local</td>
                    <td className="px-6 py-4 text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Asheville, Weaverville, Black Mountain, Fletcher
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#8FAE8F]" style={{ fontFamily: "'Poppins', sans-serif" }}>FREE</td>
                    <td className="px-6 py-4 text-center text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>-</td>
                    <td className="px-6 py-4 text-center text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>1-2 days</td>
                  </tr>

                  {/* Zone 1 */}
                  <tr className="border-b border-[#e0e0e0] bg-[#f8f9fa]">
                    <td className="px-6 py-4 font-semibold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zone 1</td>
                    <td className="px-6 py-4 text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      NC, SC, VA, GA, TN, AL, FL
                    </td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>$9.99</td>
                    <td className="px-6 py-4 text-center text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>$0.50</td>
                    <td className="px-6 py-4 text-center text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>1-3 days</td>
                  </tr>

                  {/* Zone 2 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="px-6 py-4 font-semibold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zone 2</td>
                    <td className="px-6 py-4 text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      MD, DE, WV, KY, OH, IN, MI, IL, WI, MS, LA, AR, MO
                    </td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>$12.99</td>
                    <td className="px-6 py-4 text-center text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>$0.75</td>
                    <td className="px-6 py-4 text-center text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>2-4 days</td>
                  </tr>

                  {/* Zone 3 */}
                  <tr className="border-b border-[#e0e0e0] bg-[#f8f9fa]">
                    <td className="px-6 py-4 font-semibold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zone 3</td>
                    <td className="px-6 py-4 text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      PA, NJ, NY, CT, RI, MA, VT, NH, ME, MN, IA, SD, ND, NE, KS, OK, TX
                    </td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>$14.99</td>
                    <td className="px-6 py-4 text-center text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>$1.00</td>
                    <td className="px-6 py-4 text-center text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>3-5 days</td>
                  </tr>

                  {/* Zone 4 */}
                  <tr className="border-b border-[#e0e0e0]">
                    <td className="px-6 py-4 font-semibold text-[#5E8C8C]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zone 4</td>
                    <td className="px-6 py-4 text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      MT, WY, CO, NM, AZ, UT, ID, WA, OR, CA, NV
                    </td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>$17.99</td>
                    <td className="px-6 py-4 text-center text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>$1.25</td>
                    <td className="px-6 py-4 text-center text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>4-6 days</td>
                  </tr>

                  {/* Zone 5 */}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-[#C97B63]" style={{ fontFamily: "'Poppins', sans-serif" }}>Zone 5</td>
                    <td className="px-6 py-4 text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Alaska, Hawaii
                    </td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>$29.99</td>
                    <td className="px-6 py-4 text-center text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>$2.00</td>
                    <td className="px-6 py-4 text-center text-[#666666] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>5-7 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-[#d1ecf1] border-l-4 border-[#5E8C8C] rounded-r-xl p-6">
            <p className="text-sm text-[#333333] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Example Calculation:</strong> Zone 1 order weighing 3.5 lbs
            </p>
            <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Base Rate ($9.99) + Weight (3.5 lbs × $0.50) = <strong className="text-[#8FAE8F]">$11.74 total shipping</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Fresh Food Protection */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Keeping Your Meals Fresh
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#8FAE8F] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Package className="w-5 h-5" />
                Insulated Packaging
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                All fresh meals ship in eco-friendly insulated boxes with gel ice packs. This keeps food at safe temperatures during transit, even in warm weather.
              </p>
            </div>

            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#5E8C8C] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Clock className="w-5 h-5" />
                Expedited Transit
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We use FedEx Ground for reliable 1-6 day delivery. Meals arrive fresh and ready to refrigerate or freeze immediately upon receipt.
              </p>
            </div>

            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Truck className="w-5 h-5" />
                Delivery Notifications
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                You'll receive tracking information via email once your order ships. FedEx will also send delivery alerts so you know exactly when to expect your package.
              </p>
            </div>

            <div className="bg-[#F8F5F0] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#8FAE8F] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <DollarSign className="w-5 h-5" />
                Freshness Guarantee
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                If your meals don't arrive fresh and cold, contact us immediately. We'll replace your order or provide a full refund - your satisfaction is guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping FAQs */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shipping Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                How will my fresh food stay fresh during shipping?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                All fresh meals ship in insulated containers with gel ice packs to maintain proper temperature. We use expedited FedEx Ground shipping to ensure products arrive within 1-6 days depending on your zone. Our packaging is tested to keep food cold for up to 48 hours.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#5E8C8C]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Do you ship nationwide?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Yes! We ship to all 50 US states including Alaska and Hawaii. Shipping costs vary based on your location and order weight. Orders $165+ qualify for FREE shipping.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What if I'm not home when my order arrives?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Our insulated packaging is designed to keep food fresh for several hours after delivery. However, we recommend refrigerating or freezing products as soon as possible after receiving your shipment. You can also request FedEx hold your package at a local location for pickup.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#5E8C8C]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Can I track my order?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Absolutely! Once your order ships, you'll receive a tracking number via email. You can track your package directly on FedEx.com or through the tracking link in your shipping confirmation email.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                How is shipping calculated?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shipping is calculated based on your delivery zone and total order weight. Each zone has a base rate plus a per-pound rate. For example, Zone 1 is $9.99 base + $0.50/lb. Orders $165+ qualify for FREE standard shipping. Exact shipping costs are calculated at checkout.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#5E8C8C]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What's included in the $165 free shipping threshold?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                The $165 threshold is based on your order subtotal (before tax and shipping). This typically equals 5-6 meal packs. Free shipping applies to standard FedEx Ground delivery only - expedited shipping options may have additional charges.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Do you offer local delivery?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Yes! If you're in the Asheville, NC area (including Weaverville, Black Mountain, and Fletcher), we offer FREE local delivery within 1-2 business days. We also offer FREE local pickup from our kitchen.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#5E8C8C]">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Can I schedule a specific delivery date?
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We ship orders within 1-2 business days of receiving them. While we can't guarantee a specific delivery date due to carrier scheduling, you can request delivery preferences in your order notes, and we'll do our best to accommodate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Have More Questions About Shipping?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our team is here to help with any questions about delivery, packaging, or placing your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
