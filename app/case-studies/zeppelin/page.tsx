import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Scale, Heart, CheckCircle2, Quote, Utensils, Award } from 'lucide-react';

export const metadata = {
  title: 'Zeppelin\'s Transformation | Waggin Meals Success Stories',
  description: 'How 12-year-old Zeppelin improved digestive health, joint mobility, and coat wellness through personalized nutrition with Waggin Meals.',
};

export default function ZeppelinCaseStudy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-[#8FAE8F]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <span className="inline-block bg-yellow-400 text-[#3c3a47] text-[12px] px-3 py-1 rounded-full mb-4 font-medium">
              ⭐ Senior Dog Success Story
            </span>
            <h1 className="text-[48px] font-bold mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Zeppelin\'s Journey to Wellness
            </h1>
            <p className="text-[20px] opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Transforming health for a 12-year-old through personalized whole-food nutrition
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-[#8FAE8F] hover:text-[#8fa3d9] transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Case Studies
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Dog Quick Facts */}
            <div className="bg-[#e8f4fb] rounded-2xl p-8 mb-8 border-l-4 border-[#8FAE8F]">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-[#8FAE8F] flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[32px] font-bold text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Meet Zeppelin
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#8FAE8F]" />
                      <span className="text-[#666666]"><strong>Age:</strong> 12 years old</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#8FAE8F]" />
                      <span className="text-[#666666]"><strong>Weight:</strong> 35-40 lbs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#8FAE8F]" />
                      <span className="text-[#666666]"><strong>Activity:</strong> Mild to Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8FAE8F]" />
                      <span className="text-[#666666]"><strong>Owner:</strong> Shannon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Challenge */}
            <section className="mb-12">
              <h3 className="text-[28px] font-bold text-[#3c3a47] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <div className="w-10 h-10 rounded-full bg-[#8FAE8F]/20 flex items-center justify-center">
                  <span className="text-[#8FAE8F] font-bold">1</span>
                </div>
                The Challenge
              </h3>

              <div className="bg-[#fff8f0] border-l-4 border-orange-400 p-6 rounded-r-lg mb-6">
                <p className="text-[16px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  At 12 years old, Zeppelin was experiencing the common challenges many senior dogs face. Shannon was concerned about supporting her aging companion through proper nutrition.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border-2 border-[#ffd4d4] rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#ffd4d4] flex items-center justify-center mx-auto mb-3">
                    <Utensils className="w-6 h-6 text-[#d63447]" />
                  </div>
                  <h4 className="text-[16px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Digestive Health
                  </h4>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Needed support for optimal digestion
                  </p>
                </div>

                <div className="bg-white border-2 border-[#d4e5ff] rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#d4e5ff] flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-[#4a90e2]" />
                  </div>
                  <h4 className="text-[16px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Joint & Mobility
                  </h4>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Senior dog needing joint support
                  </p>
                </div>

                <div className="bg-white border-2 border-[#d4f4dd] rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#d4f4dd] flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-[#50c878]" />
                  </div>
                  <h4 className="text-[16px] font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Skin & Coat
                  </h4>
                  <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Maintaining healthy skin and coat
                  </p>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-xl p-6">
                <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Previous Diet
                </h4>
                <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Zeppelin was eating Farmers Dog twice daily. While this was a quality commercial diet, Shannon wanted to explore personalized whole-food nutrition tailored specifically to Zeppelin\'s senior needs.
                </p>
              </div>
            </section>

            {/* Christie\'s Approach */}
            <section className="mb-12">
              <h3 className="text-[28px] font-bold text-[#3c3a47] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <div className="w-10 h-10 rounded-full bg-[#8FAE8F]/20 flex items-center justify-center">
                  <span className="text-[#8FAE8F] font-bold">2</span>
                </div>
                Christie\'s Clinical Recommendation
              </h3>

              <div className="bg-[#8FAE8F]/10 rounded-2xl p-8 mb-6 border-2 border-[#8FAE8F]/20">
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-8 h-8 text-[#8FAE8F] flex-shrink-0" />
                  <div>
                    <p className="text-[16px] text-[#3c3a47] mb-4 italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      "I recommend transitioning from Farmers Dog to Waggin Meals, a whole-food-based diet tailored to support Zeppelin\'s digestive health, joint mobility, and skin & coat wellness."
                    </p>
                    <p className="text-[14px] text-[#666666] font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      — Christie Naquin, Board-Certified Animal Nutritionist
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border-2 border-[#e0e0e0] rounded-xl p-6">
                  <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    For Digestive Health
                  </h4>
                  <ul className="space-y-2 text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Plain Yogurt:</strong> Probiotics for gut health</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Pumpkin:</strong> Fiber for digestive regularity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Sweet Potatoes, Blueberries & Carrots:</strong> Antioxidants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Bone Broth:</strong> Amino acids for gut lining support</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-[#e0e0e0] rounded-xl p-6">
                  <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    For Joint & Mobility Support
                  </h4>
                  <ul className="space-y-2 text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Fatty Fish:</strong> Rich in omega-3s for inflammation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Eggs:</strong> High-quality protein and biotin</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Bone Broth:</strong> Collagen and anti-inflammatory compounds</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border-2 border-[#e0e0e0] rounded-xl p-6">
                  <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <CheckCircle2 className="w-5 h-5 text-[#5E8C8C]" />
                    For Skin & Coat Health
                  </h4>
                  <ul className="space-y-2 text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Coconut Oil:</strong> Healthy fats for skin moisture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Lean Proteins:</strong> Building blocks for coat health</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8FAE8F] mt-1">•</span>
                      <span><strong>Flaxseed & Salmon Oil:</strong> Omega fatty acids</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#fff8e1] border-l-4 border-yellow-400 p-6 rounded-r-lg mt-6">
                <p className="text-[15px] text-[#666666] font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  💡 <strong>Christie\'s Note:</strong> Bone broth is essential for collagen and amino acids that benefit digestion, joint strength, and skin health in senior dogs like Zeppelin.
                </p>
              </div>
            </section>

            {/* The Feeding Plan */}
            <section className="mb-12">
              <h3 className="text-[28px] font-bold text-[#3c3a47] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <div className="w-10 h-10 rounded-full bg-[#8FAE8F]/20 flex items-center justify-center">
                  <span className="text-[#8FAE8F] font-bold">3</span>
                </div>
                Personalized Feeding Plan
              </h3>

              <div className="bg-[#f0f4ff] rounded-2xl p-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Daily Feeding
                    </h4>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-[24px] font-bold text-[#8FAE8F] mb-1">2.0-2.5 cups</p>
                      <p className="text-[14px] text-[#666666]">Split into two meals</p>
                      <p className="text-[14px] text-[#666666]">1-1¼ cups each</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Weekly Needs
                    </h4>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-[24px] font-bold text-[#8FAE8F] mb-1">14.0-17.5 cups</p>
                      <p className="text-[14px] text-[#666666]">3.5-4.4 packs per week</p>
                      <p className="text-[14px] text-[#666666]">(4 cups per pack)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-lg p-6">
                  <h4 className="text-[16px] font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Recommendations:
                  </h4>
                  <ul className="space-y-2 text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Order 1 extra pack per week for backup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Recommended formulas: <strong>Lamb, Salmon, or Beef</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Bone Broth: 2-3 tablespoons per meal</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-[#e0e0e0] rounded-xl p-6">
                <h4 className="text-[18px] font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Fresh Whole Food Feeding Guide
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <thead className="bg-[#8FAE8F]/10">
                      <tr>
                        <th className="text-left p-3 text-[#3c3a47]">Weight Range</th>
                        <th className="text-left p-3 text-[#3c3a47]">Daily Cups</th>
                        <th className="text-left p-3 text-[#3c3a47]">Active (+0.25)</th>
                        <th className="text-left p-3 text-[#3c3a47]">Weekly Cups</th>
                        <th className="text-left p-3 text-[#3c3a47]">Packs/week</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#666666]">
                      <tr className="border-b border-[#e0e0e0] bg-[#fff8e1]">
                        <td className="p-3 font-semibold">31-40 lbs</td>
                        <td className="p-3">1.75-2.25</td>
                        <td className="p-3">2.0-2.5</td>
                        <td className="p-3">14.0</td>
                        <td className="p-3">3.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Special Offer */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Special Welcome Offer
                </h3>
                <ul className="space-y-3 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>FREE shipping</strong> on first order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>FREE Bone Broth</strong> ($14 value)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ongoing shipping: <strong>$14.99</strong> (reduced from $29.99)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Orders over <strong>$165</strong> get free shipping</span>
                  </li>
                </ul>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e0e0e0]">
                <h3 className="text-[20px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Product Details
                </h3>
                <ul className="space-y-3 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" />
                    <span>4-cup BPA-free vacuum-sealed packs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" />
                    <span>Arrives frozen; thaw and refreeze as needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" />
                    <span>Seasonal proteins: Venison & Alaskan Salmon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" />
                    <span>Small batch crafted for quality and freshness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" />
                    <span>Sourced from our garden and trusted farms</span>
                  </li>
                </ul>
              </div>

              {/* Helpful Resources */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e0e0e0]">
                <h3 className="text-[18px] font-bold text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Helpful Resources
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/feeding-calculator"
                    className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-[#e8f4fb] transition-colors group"
                  >
                    <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      🔢 Feeding Calculator
                    </span>
                    <span className="text-[#8FAE8F] group-hover:text-[#bc2c2c]">→</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-[#e8f4fb] transition-colors group"
                  >
                    <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      📖 Nutrition Insights
                    </span>
                    <span className="text-[#8FAE8F] group-hover:text-[#bc2c2c]">→</span>
                  </Link>
                  <Link
                    href="/testimonials"
                    className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-[#e8f4fb] transition-colors group"
                  >
                    <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ⭐ Client Testimonials
                    </span>
                    <span className="text-[#8FAE8F] group-hover:text-[#bc2c2c]">→</span>
                  </Link>
                  <Link
                    href="/guides/fresh-food-guide"
                    className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-[#e8f4fb] transition-colors group"
                  >
                    <span className="text-[14px] font-medium text-[#3c3a47] group-hover:text-[#bc2c2c]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      📚 Fresh Food Guide
                    </span>
                    <span className="text-[#8FAE8F] group-hover:text-[#bc2c2c]">→</span>
                  </Link>
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-[#8FAE8F]/10 rounded-2xl p-6 border-2 border-[#8FAE8F]/20">
                <h3 className="text-[18px] font-bold text-[#3c3a47] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Referral Rewards
                </h3>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  For every person you refer, earn <strong className="text-[#8FAE8F]">$10 credit</strong> towards your next order!
                </p>
                <p className="text-[13px] text-[#666666] italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Paige will thank you... hint, wink. 😉
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/nutrition-services"
                className="block w-full bg-[#8FAE8F] text-white text-center px-6 py-4 rounded-full hover:bg-[#8fa3d9] transition-colors font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Get Your Custom Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Why Waggin Meals Section */}
        <div className="mt-16 bg-[#f8f9fa] rounded-3xl p-12 text-center">
          <h2 className="text-[36px] font-bold text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Waggin Meals?
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-[18px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              At Waggin Meals, every bite matters, and every dog we serve is important. We craft meals in small batches for quality and freshness, sourcing from our garden and trusted farms committed to sustainability.
            </p>
            <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Your dog\'s health and happiness are at the heart of everything we do. By choosing Waggin Meals, you\'re joining a community that values personalized care and wellness.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/contact"
                className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full hover:bg-[#8fa3d9] transition-colors font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Start Your Journey
              </Link>
              <Link
                href="/case-studies"
                className="bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-full hover:bg-[#8FAE8F] hover:text-white transition-colors font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                More Success Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
