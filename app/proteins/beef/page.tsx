import Link from 'next/link';
import { Check, X, AlertCircle, Heart, Beef as BeefIcon, Sparkles } from 'lucide-react';

export default function BeefProteinPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BeefIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Is Beef Right for Your Dog?
          </h1>
          <p className="text-xl text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            A complete guide to beef as a protein source for your dog's diet
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-[17px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong className="text-[#8FAE8F]">Beef</strong> is a nutrient-dense protein that's been a staple in dog food for decades. Rich in essential amino acids, iron, zinc, and B vitamins, beef provides excellent nutrition for muscle development, energy, and overall health. However, it's also one of the most common food allergens in dogs, so understanding when beef is beneficial—and when it's not—is crucial for your dog's wellbeing.
            </p>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Benefits */}
            <div className="bg-[#F8F5F0] rounded-2xl p-8 border-2 border-[#8FAE8F]">
              <h3 className="text-2xl font-normal text-[#8FAE8F] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <Check className="w-8 h-8" />
                Benefits of Beef
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Rich in Complete Protein</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Contains all essential amino acids for muscle growth and repair</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>High in Iron & Zinc</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Supports red blood cell production and immune function</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Packed with B Vitamins</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Especially B12, B6, and niacin for energy metabolism</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Highly Palatable</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Most dogs love the taste, making it great for picky eaters</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Supports Muscle Mass</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Excellent for active dogs, working dogs, and muscle recovery</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Concerns */}
            <div className="bg-[#F8F5F0] rounded-2xl p-8 border-2 border-[#C97B63]">
              <h3 className="text-2xl font-normal text-[#C97B63] mb-6 flex items-center gap-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <AlertCircle className="w-8 h-8" />
                Potential Concerns
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Common Allergen</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>One of the top 3 food allergens in dogs (along with dairy and chicken)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Fat Content Varies</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Ground beef can be high in fat - problematic for pancreatitis-prone dogs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Not Ideal for Elimination Diets</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Most dogs have been exposed to beef, so it's not a "novel" protein</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Quality Matters</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Conventional beef may contain hormones and antibiotics - grass-fed is better</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#333333] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Environmental Impact</p>
                    <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>Beef production has a higher carbon footprint than poultry or fish</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritional Profile */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Nutritional Profile
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-4 gap-8 text-center mb-8">
              <div>
                <p className="text-4xl font-bold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>26-32%</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Protein</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Dry matter basis)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>10-20%</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Fat</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Varies by cut)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>High</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Iron</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Heme iron)</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#8FAE8F] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>High</p>
                <p className="text-sm text-[#666666] uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>B12</p>
                <p className="text-xs text-[#999999] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>(Cobalamin)</p>
              </div>
            </div>

            <div className="border-t border-[#e0e0e0] pt-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Key Nutrients in Beef:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>Iron:</strong> Essential for oxygen transport and energy</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>Zinc:</strong> Supports immune function and skin health</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>B12:</strong> Vital for nerve function and red blood cells</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>B6:</strong> Supports protein metabolism and brain health</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>Niacin (B3):</strong> Energy production and DNA repair</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>Selenium:</strong> Antioxidant protection and thyroid health</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>Phosphorus:</strong> Bone health and energy metabolism</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FAE8F] mt-0.5" />
                  <span><strong>Creatine:</strong> Supports muscle energy and recovery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Beef */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            When to Choose Beef
          </h2>

          <div className="space-y-6">
            <div className="bg-[#F8F5F0] rounded-xl p-6 border-l-4 border-[#8FAE8F]">
              <h3 className="text-lg font-semibold text-[#8FAE8F] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <Heart className="w-5 h-5" />
                Beef is Excellent For:
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <span><strong>Active & Working Dogs:</strong> High protein content supports muscle development and recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <span><strong>Growing Puppies:</strong> Rich in nutrients needed for development (when properly balanced)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <span><strong>Anemic Dogs:</strong> High heme iron content helps restore red blood cell levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <span><strong>Picky Eaters:</strong> Highly palatable and appealing to most dogs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FAE8F] mt-0.5 flex-shrink-0" />
                  <span><strong>Dogs with No Food Sensitivities:</strong> When allergies aren't a concern, beef provides excellent nutrition</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#fff3cd] rounded-xl p-6 border-l-4 border-[#C97B63]">
              <h3 className="text-lg font-semibold text-[#C97B63] mb-3 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <AlertCircle className="w-5 h-5" />
                Consider Alternatives If:
              </h3>
              <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Chronic Skin Issues:</strong> Beef is a common allergen - try novel proteins instead</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Digestive Problems:</strong> If your dog has chronic diarrhea, vomiting, or gas after eating beef</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Pancreatitis History:</strong> High-fat beef cuts can trigger flare-ups (lean cuts may be okay)</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Elimination Diets:</strong> Beef has likely been consumed before - use novel proteins like venison or rabbit</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-[#C97B63] mt-0.5 flex-shrink-0" />
                  <span><strong>Weight Management:</strong> Higher fat content requires careful portion control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Source Matters */}
      <section className="bg-[#F8F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Source & Quality Matter
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-[15px] text-[#666666] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Not all beef is created equal. The source and quality of beef significantly impact its nutritional value and safety for your dog.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#F8F5F0] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#8FAE8F] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ✅ Look For:
                </h3>
                <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8FAE8F]">•</span>
                    <span>Grass-fed, pasture-raised beef</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8FAE8F]">•</span>
                    <span>Hormone and antibiotic-free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8FAE8F]">•</span>
                    <span>Human-grade quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8FAE8F]">•</span>
                    <span>US-sourced (NC, TN, GA preferred)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8FAE8F]">•</span>
                    <span>Lean cuts for sensitive dogs</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#fff3cd] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#C97B63] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ⚠️ Avoid:
                </h3>
                <ul className="space-y-2 text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Feed-grade beef byproducts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Meat from unknown sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>High-fat ground beef ({'>'}20% fat)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Conventional beef with hormones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C97B63]">•</span>
                    <span>Seasoned or processed beef products</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to Try Our Beef Meals?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We use grass-fed, locally-sourced beef from NC, TN, and GA farms. Human-grade quality, gently cooked, and perfectly balanced for your dog's health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Beef Meals
            </Link>
            <Link
              href="/nutrition-services"
              className="bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg inline-block"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Get Custom Nutrition Plan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
