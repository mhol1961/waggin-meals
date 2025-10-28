'use client';

import Image from 'next/image';

export default function MarketBrochurePage() {
  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>

      <main className="bg-white">
        {/* Print Button - Hides when printing */}
        <div className="no-print fixed top-4 right-4 z-50">
          <button
            onClick={() => window.print()}
            className="bg-[#2f4b38] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3d5e49] shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Print or Save as PDF
          </button>
        </div>

        {/* Brochure Content */}
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b-4 border-[#2f4b38] pb-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo-waggin-meals.png"
                alt="Waggin Meals"
                width={120}
                height={120}
                className="rounded-full border-4 border-[#2f4b38]"
              />
            </div>
            <h1 className="text-5xl font-bold text-[#2f4b38] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Waggin Meals Pet Nutrition Co.
            </h1>
            <p className="text-2xl text-[#a4341f] italic mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              "Doggy Farm Kitchens weren't a thing ~ until now!"
            </p>
            <div className="bg-[#f5f1ea] p-4 rounded-lg inline-block">
              <p className="text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                📱 www.wagginmeals.com
              </p>
            </div>
          </div>

          {/* Mission & Promise */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f5f1ea] p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-[#2f4b38] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Our Mission
              </h2>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                At Waggin Meals, we believe your dog deserves the same care and quality you expect for your family. That's why we partner with local farmers and use human-grade ingredients to craft meals that are fresh, wholesome, and tailored to your pup's health needs.
              </p>
            </div>

            <div className="bg-[#2f4b38] text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Our Promise
              </h2>
              <ul className="text-sm space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>✓ Human-Grade Ingredients</li>
                <li>✓ Small Batch Cooking</li>
                <li>✓ Sustainably Sourced</li>
                <li>✓ Gently Cooked for Maximum Nutrition</li>
                <li>✓ FDA Pet Food Program approved & AAFCO standards</li>
              </ul>
            </div>
          </div>

          {/* Why Choose Section */}
          <div className="bg-[#a4341f] text-white p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Why Choose Waggin Meals?
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div>
                <p className="font-semibold mb-2">Farm-fresh dog food formulated by an Animal Nutritionist</p>
                <p>Handmade, small-batch meals & toppers</p>
              </div>
              <div>
                <p className="font-bold mb-2">Benefits for Your Dog:</p>
                <ul className="space-y-1">
                  <li>✓ Easier digestion & immune support</li>
                  <li>✓ Healthier skin & coat</li>
                  <li>✓ Weight management</li>
                  <li>✓ No artificial flavors, preservatives, or harmful chemicals</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="page-break"></div>

          {/* Menu Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2f4b38] mb-6 border-b-2 border-[#2f4b38] pb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Menu - Subscribe & Save Pricing
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#2f4b38] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Meals (4-cup vacuum-sealed packs)
                </h3>
                <div className="grid gap-3">
                  <div className="bg-[#f5f1ea] p-4 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Chicken & Rice or Sweet Potato</span>
                      <span className="text-xl font-bold text-[#a4341f]">$15.51</span>
                    </div>
                    <p className="text-sm">Lean protein for muscle health, fiber & antioxidants for digestion.</p>
                  </div>

                  <div className="bg-[#f5f1ea] p-4 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Turkey & Rice or Sweet Potato</span>
                      <span className="text-xl font-bold text-[#a4341f]">$15.51</span>
                    </div>
                    <p className="text-sm">Low-fat protein for weight control, immune support.</p>
                  </div>

                  <div className="bg-[#f5f1ea] p-4 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Beef & Rice or Sweet Potato</span>
                      <span className="text-xl font-bold text-[#a4341f]">$16.49</span>
                    </div>
                    <p className="text-sm">Iron & zinc for energy and coat health, strong muscles.</p>
                  </div>

                  <div className="bg-[#2f4b38] text-white p-4 rounded">
                    <p className="font-bold">Fish, Venison & Rabbit – Seasonally Available</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#2f4b38] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Boost Nutrition – Best Sellers
                </h3>
                <div className="grid gap-3">
                  <div className="bg-[#f5f1ea] p-4 rounded border-2 border-[#a4341f]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Bone & Veggie Broth</span>
                      <span className="text-xl font-bold text-[#a4341f]">$13.51</span>
                    </div>
                    <p className="text-sm mb-2">Joint support (collagen), gut health, hydration boost. <strong>BEST SELLER</strong></p>
                    <p className="text-xs"><strong>How to Use:</strong> Mix ½ cup broth per 4 cups of food OR Add 1–2 tbsp per ¼ cup of food</p>
                  </div>

                  <div className="bg-[#f5f1ea] p-4 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">Prince Jax Stew</span>
                      <span className="text-xl font-bold text-[#a4341f]">$18.71</span>
                    </div>
                    <p className="text-sm mb-2">Bone broth base, high-protein, immune support, extra hydration.</p>
                    <p className="text-xs"><strong>How to Use:</strong> Mix ½ cup stew with 4 cups of food OR Use as a topper or special meal</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#2f4b38] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Toppers
                </h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between bg-[#f5f1ea] p-3 rounded">
                    <span><strong>Chicken Superfood Cakes</strong> (4 cakes, 1 cake ≈ ½ cup)</span>
                    <span className="font-bold text-[#a4341f]">$13.82</span>
                  </div>
                  <div className="flex justify-between bg-[#f5f1ea] p-3 rounded">
                    <span><strong>Pup-a-Loaf</strong> (One loaf ≈ 1.5 cups)</span>
                    <span className="font-bold text-[#a4341f]">$13.58</span>
                  </div>
                  <div className="flex justify-between bg-[#f5f1ea] p-3 rounded border-2 border-[#a4341f]">
                    <span><strong>Hand-Rolled Beef Meatballs</strong> BEST SELLER</span>
                    <span className="font-bold text-[#a4341f]">$16.99</span>
                  </div>
                  <div className="flex justify-between bg-[#f5f1ea] p-3 rounded">
                    <span><strong>Dehydrated Toppers</strong></span>
                    <span className="font-bold text-[#a4341f]">$18.98–$19.98</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-break"></div>

          {/* Bundles Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2f4b38] mb-4 border-b-2 border-[#2f4b38] pb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Bundles & Savings (Includes Shipping)
            </h2>
            <p className="text-sm mb-6 italic">Add $1 per Beef Meal | One Time Purchase or Recurring options | Does not Include Prince Jax Stew</p>

            <div className="grid gap-4">
              <div className="bg-[#f5f1ea] border-2 border-[#2f4b38] p-6 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-[#2f4b38]">Smart Pup Starter Pack</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#a4341f]">$71.98</div>
                    <div className="text-sm text-green-700 font-bold">Save $8.00</div>
                  </div>
                </div>
                <p className="font-semibold mb-2">2 Meals, 1 Broth, 1 Fresh Topper</p>
              </div>

              <div className="bg-[#2f4b38] text-white border-2 border-[#a4341f] p-6 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="bg-[#a4341f] text-white text-xs px-3 py-1 rounded-full font-bold">MOST POPULAR</span>
                    <h3 className="text-2xl font-bold mt-2">Standard Pup Pack</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">$146.99</div>
                    <div className="text-sm text-[#ffc107] font-bold">Save $17.00</div>
                  </div>
                </div>
                <p className="font-semibold">6 Meals, 1 Broth, 1 Fresh Topper</p>
              </div>

              <div className="bg-[#a4341f] text-white border-4 border-[#ffc107] p-6 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="bg-[#ffc107] text-[#2f4b38] text-xs px-3 py-1 rounded-full font-bold">BEST VALUE</span>
                    <h3 className="text-2xl font-bold mt-2">Premium Pup Pack</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">$169.99</div>
                    <div className="text-sm text-[#ffc107] font-bold">Save $19.00</div>
                  </div>
                </div>
                <p className="font-semibold">10 Meals, 2 Broths</p>
              </div>

              <div className="bg-[#f5f1ea] border-2 border-[#2f4b38] p-6 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-[#2f4b38]">Waggin Meals Club Box</h3>
                  <div className="text-3xl font-bold text-[#a4341f]">$49.99</div>
                </div>
                <p className="font-semibold">Recurring every 4, 6, or 8 weeks – 3 tail-waggin goodies + surprise!</p>
              </div>
            </div>
          </div>

          {/* Feeding Guide */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#2f4b38] mb-4 border-b-2 border-[#2f4b38] pb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Feeding Guide
            </h2>
            <p className="text-sm mb-4 italic">Split into 2 meals per day | Each meal pack = 4 cups (vacuum-sealed for freshness) | All meals can be thawed and refrozen safely</p>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#2f4b38] text-white">
                  <th className="border border-[#2f4b38] p-2">Dog Weight</th>
                  <th className="border border-[#2f4b38] p-2">Cups per Day</th>
                  <th className="border border-[#2f4b38] p-2">Cups per Meal</th>
                  <th className="border border-[#2f4b38] p-2">Packs per Week*</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#f5f1ea]">
                  <td className="border border-gray-300 p-2">5–10 lbs</td>
                  <td className="border border-gray-300 p-2">½ – 1 cup</td>
                  <td className="border border-gray-300 p-2">¼ – ½ cup</td>
                  <td className="border border-gray-300 p-2 font-bold">1 – 2 packs</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">11–20 lbs</td>
                  <td className="border border-gray-300 p-2">1 – 1½ cups</td>
                  <td className="border border-gray-300 p-2">½ – ¾ cup</td>
                  <td className="border border-gray-300 p-2 font-bold">2 – 3 packs</td>
                </tr>
                <tr className="bg-[#f5f1ea]">
                  <td className="border border-gray-300 p-2">21–30 lbs</td>
                  <td className="border border-gray-300 p-2">1½ – 2¼ cups</td>
                  <td className="border border-gray-300 p-2">¾ – 1⅛ cups</td>
                  <td className="border border-gray-300 p-2 font-bold">3 – 4 packs</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">31–50 lbs</td>
                  <td className="border border-gray-300 p-2">2¼ – 3¾ cups</td>
                  <td className="border border-gray-300 p-2">1⅛ – 1⅞ cups</td>
                  <td className="border border-gray-300 p-2 font-bold">4 – 7 packs</td>
                </tr>
                <tr className="bg-[#f5f1ea]">
                  <td className="border border-gray-300 p-2">51–75 lbs</td>
                  <td className="border border-gray-300 p-2">3¾ – 5½ cups</td>
                  <td className="border border-gray-300 p-2">1⅞ – 2¾ cups</td>
                  <td className="border border-gray-300 p-2 font-bold">7 – 10 packs</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">76–100 lbs</td>
                  <td className="border border-gray-300 p-2">5½ – 7½ cups</td>
                  <td className="border border-gray-300 p-2">2¾ – 3¾ cups</td>
                  <td className="border border-gray-300 p-2 font-bold">10 – 14 packs</td>
                </tr>
              </tbody>
            </table>

            <p className="text-xs mt-3 italic">*Based on 7 days of feeding. Adjust for activity level as needed.</p>

            <div className="bg-[#f5f1ea] p-4 rounded mt-4">
              <h4 className="font-bold mb-2">Examples:</h4>
              <ul className="text-sm space-y-1">
                <li>• 10 lbs → ½ cup AM + ½ cup PM → 1 pack lasts ~4 days</li>
                <li>• 20 lbs → ¾ cup AM + ¾ cup PM → 1 pack lasts ~2.5 days</li>
                <li>• 50 lbs → 1¾ cups AM + 1¾ cups PM → 1 pack lasts ~1 day</li>
              </ul>
            </div>

            <div className="bg-[#2f4b38] text-white p-4 rounded mt-4">
              <h4 className="font-bold mb-2">Helpful Tips:</h4>
              <ul className="text-sm space-y-1">
                <li>✓ Check body condition regularly</li>
                <li>✓ Add ¼–½ cup for active dogs</li>
                <li>✓ Puppies and seniors may need more frequent meals</li>
              </ul>
            </div>
          </div>

          {/* How to Order */}
          <div className="bg-[#a4341f] text-white p-6 rounded-lg mb-8">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              How to Order
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold mb-2">🌐 Shop Online:</p>
                <p className="text-lg">www.wagginmeals.com</p>
              </div>
              <div>
                <p className="font-bold mb-2">📞 Call for a Custom Plan</p>
                <p>✓ Free Local Delivery & Nationwide Shipping</p>
                <p>✓ Autoship & Save 3%</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t-2 border-[#2f4b38] pt-4 text-xs text-center text-gray-600">
            <p>Our meals are formulated for dogs only. Not for human consumption. Always consult your vet for health decisions.</p>
          </div>
        </div>
      </main>
    </>
  );
}
