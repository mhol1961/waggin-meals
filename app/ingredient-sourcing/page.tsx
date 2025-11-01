import Link from 'next/link';
import Image from 'next/image';
import { Leaf, MapPin, Award, ShieldCheck, Heart, Sprout, Check } from 'lucide-react';

export default function IngredientSourcingPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#f0fdf4] via-white to-[#fef3c7] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-full px-5 py-2 mb-6">
            <Leaf className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">Farm-to-Bowl Transparency</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            <span className="text-[#10b981]">Know What's</span> in the Bowl
            <br />
            Trust Where It's From
          </h1>

          <p className="text-xl text-[#666666] mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We believe you deserve to know exactly where every ingredient comes from. That's why we source from{' '}
            <strong className="text-[#3c3a47]">local farms, trusted partners, and our own sustainable operations</strong>—
            bringing transparency to every meal.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { icon: MapPin, text: 'Locally Sourced', color: 'blue' },
              { icon: Leaf, text: 'Sustainably Grown', color: 'green' },
              { icon: ShieldCheck, text: 'USDA Certified', color: 'purple' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <span className="text-sm font-semibold text-[#3c3a47]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Sourcing Philosophy */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Our Sourcing Philosophy
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Local First',
                desc: 'We prioritize partnerships with local farmers and producers—supporting our community while ensuring the freshest ingredients.'
              },
              {
                icon: Leaf,
                title: 'Sustainable Practices',
                desc: 'Every supplier must meet our sustainability standards—from regenerative farming to humane animal treatment.'
              },
              {
                icon: ShieldCheck,
                title: 'Quality Guaranteed',
                desc: "Human-grade, USDA-certified ingredients only. If we wouldn't eat it ourselves, it doesn't go in the bowl."
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#f5f5f5] rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3">{item.title}</h3>
                <p className="text-[15px] text-[#666666] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient Breakdown */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Where Our Ingredients Come From
          </h2>

          <div className="space-y-8">
            {[
              {
                category: 'Proteins',
                icon: '🥩',
                items: [
                  { name: 'Grass-Fed Beef', source: 'Local ranches in Kansas (within 50 miles)', why: 'Higher omega-3s, better for the environment, supports local ranchers' },
                  { name: 'Organic Chicken', source: 'Family farms in Missouri', why: 'No antibiotics, free-range, humane treatment standards' },
                  { name: 'Wild-Caught Fish', source: 'Alaska and Pacific Northwest', why: 'Sustainable fisheries, high omega-3 content, mercury-tested' }
                ]
              },
              {
                category: 'Vegetables & Fruits',
                icon: '🥬',
                items: [
                  { name: 'Sweet Potatoes & Carrots', source: 'Our own farm + local organic farms', why: 'Nutrient-dense, pesticide-free, seasonal harvesting' },
                  { name: 'Kale, Spinach & Greens', source: 'Local organic co-ops', why: 'Fresh-picked within 24 hours, maximum nutrient retention' },
                  { name: 'Blueberries & Superfoods', source: 'Midwest organic farms', why: 'Antioxidant-rich, non-GMO, sustainably farmed' }
                ]
              },
              {
                category: 'Grains & Supplements',
                icon: '🌾',
                items: [
                  { name: 'Organic Oats & Quinoa', source: 'Certified organic suppliers', why: 'Easily digestible, gluten-free options available, non-GMO' },
                  { name: 'Bone Broth Base', source: 'Made in-house from grass-fed bones', why: 'Maximum collagen extraction, no preservatives, fresh daily' },
                  { name: 'Supplements & Herbs', source: 'Certified organic herb suppliers', why: 'Therapeutic-grade, third-party tested, traceable origins' }
                ]
              }
            ].map((section, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
                  <div className="flex items-center">
                    <span className="text-5xl mr-4">{section.icon}</span>
                    <h3 className="text-3xl font-semibold text-white">{section.category}</h3>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  {section.items.map((item, j) => (
                    <div key={j} className="border-l-4 border-green-500 pl-6 py-2">
                      <h4 className="text-lg font-semibold text-[#3c3a47] mb-2">{item.name}</h4>
                      <div className="flex items-start mb-2">
                        <MapPin className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-sm text-[#666666]"><strong>Source:</strong> {item.source}</p>
                      </div>
                      <div className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-sm text-[#666666]"><strong>Why:</strong> {item.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Farm */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-amber-50 border border-amber-200 rounded-full px-4 py-2 mb-4">
                <Sprout className="w-4 h-4 text-amber-600 mr-2" />
                <span className="text-sm font-semibold text-amber-700">Waggin Meals Farm</span>
              </div>

              <h2 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Grown on Our Own Land
              </h2>

              <p className="text-lg text-[#666666] mb-6 leading-relaxed">
                Many of our vegetables and herbs come directly from the Waggin Meals farm—where we practice{' '}
                <strong className="text-[#3c3a47]">regenerative agriculture, composting, and seasonal crop rotation.</strong>
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  'Pesticide-free growing practices',
                  'Rainwater collection systems',
                  'Composting from meal prep waste',
                  'Pollinator-friendly gardens',
                  'No synthetic fertilizers or chemicals'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-[15px] text-[#666666]">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-[15px] text-[#666666] leading-relaxed italic">
                "When you control the source, you control the quality. That's why we grow as much as we can ourselves."
                <br />
                <span className="font-semibold not-italic">— Christie A. Willett, M.S.</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative h-72 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                  alt="Fresh farm ingredients"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-72 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                  alt="Farm fresh harvest"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standards & Certifications */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Our Standards & Certifications
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'USDA Certified', desc: 'All proteins meet USDA human-grade standards' },
              { icon: Award, title: 'FDA Approved', desc: 'Kitchen facility approved through FDA Pet Feed Program' },
              { icon: Leaf, title: 'Organic Where Possible', desc: '75% of produce is certified organic' },
              { icon: Heart, title: 'Humane Certified', desc: 'All animal proteins from humanely-raised sources' }
            ].map((cert, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-14 h-14 bg-[#a5b5eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="w-7 h-7 text-[#a5b5eb]" />
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2">{cert.title}</h3>
                <p className="text-sm text-[#666666]">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Don't Use */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] text-center mb-12" style={{ fontFamily: "'Abril Fatface', serif" }}>
            What You'll NEVER Find in Our Food
          </h2>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-10 border-l-4 border-red-500">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Artificial preservatives or colors',
                'Rendered by-products or "meals"',
                'Corn, wheat, or soy fillers',
                'Synthetic vitamins (we use whole foods)',
                'GMO ingredients',
                'Antibiotics or growth hormones',
                'Factory-farmed proteins',
                'Imported ingredients from unknown sources'
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-white font-bold text-xs">✕</span>
                  </div>
                  <span className="text-[15px] text-[#3c3a47] font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-normal mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Transparency You Can Trust
          </h2>
          <p className="text-lg mb-8">
            We're proud to show you exactly where your dog's food comes from. Have questions about a specific ingredient?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nutrition-services"
              className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Ask Christie
            </Link>
            <Link
              href="/shop"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Shop Our Meals
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-90">100% Ingredient Transparency • Farm-to-Bowl Traceability</p>
        </div>
      </section>
    </main>
  );
}
