import Link from 'next/link';
import Image from 'next/image';
import { Crown, Shield, Sparkles, Star, Check, Award } from 'lucide-react';

export default function PremiumExperienceFullPage() {
  return (
    <main className="bg-white">
      <nav className="bg-white shadow-sm py-4 px-4 border-b border-gray-200">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/"><img src="/images/logo-waggin-meals.png" alt="Waggin Meals" className="h-12 w-auto" /></Link>
          <div className="flex gap-4 text-sm">
            <Link href="/hero-variations" className="text-[#666666] hover:text-[#a5b5eb] font-semibold">← Back to Variations</Link>
            <Link href="/" className="text-[#666666] hover:text-[#a5b5eb]">Current Home</Link>
          </div>
        </div>
      </nav>

      <section className="bg-[#f0f7ff] border-b-2 border-[#a5b5eb] px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-[16px] font-semibold text-[#3c3a47] mb-2 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Our Promise</h3>
          <p className="text-[14px] text-[#666666] leading-relaxed mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an Animal Nutritionist to meet <strong>AAFCO standards for dog(s) of all ages</strong>.
          </p>
          <p className="text-[13px] text-[#666666] leading-relaxed text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong>Important Info:</strong> Our meals are specially formulated for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your vet for any health-related decisions about your dog.
          </p>
        </div>
      </section>

      {/* HERO: VARIATION D - THE PREMIUM EXPERIENCE */}
      <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {[{top: 20, left: 20, size: 8}, {top: 40, right: 40, size: 6}, {bottom: 32, left: '25%', size: 5}, {bottom: 20, right: '33%', size: 7}].map((s, i) => (
            <Sparkles key={i} className={`absolute text-amber-300 opacity-50`} style={{top: s.top, left: s.left, right: s.right, bottom: s.bottom, width: s.size*4, height: s.size*4}} />
          ))}
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-amber-400/20 border border-amber-400/40 rounded-full px-6 py-3">
              <Crown className="w-5 h-5 text-amber-400 mr-2" />
              <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Exclusive Concierge Service</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-7xl font-normal text-white mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
              White-Glove{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Nutrition Care</span>
              <br />
              For Your Beloved Companion
            </h1>

            <p className="text-xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Experience comprehensive, personalized nutrition care from a dual Master's-level nutritionist—
              <strong className="text-white"> where your dog's health becomes our masterpiece.</strong>
            </p>

            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl px-10 py-6 mb-12 border border-white/20">
              <div className="mr-6">
                <Award className="w-12 h-12 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-semibold text-white mb-1">Christie A. Willett</p>
                <p className="text-amber-300 font-semibold mb-1">M.A., M.S. | Canine Integrative Nutritionist</p>
                <p className="text-sm text-gray-300">15+ Years | 500+ Elite Client Success Stories</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {icon: Shield, title: 'Comprehensive Assessment', desc: 'In-depth health history, food sensitivity testing, and advanced nutritional analysis—leaving no stone unturned.'},
              {icon: Star, title: 'Bespoke Nutrition Plan', desc: "Custom-designed meal plans with recipes, supplements, and ongoing adjustments as your dog's needs evolve."},
              {icon: Crown, title: 'Priority VIP Access', desc: 'Direct access to Christie for questions, meal delivery coordination, and complimentary follow-up consultations.'}
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-white/20">
            <h2 className="text-3xl font-normal text-white text-center mb-8" style={{ fontFamily: "'Abril Fatface', serif" }}>Your Exclusive Experience Includes</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {title: '90-Minute Initial Consultation', desc: 'Deep-dive assessment with Christie (in-person or virtual)'},
                {title: 'Complete Food Sensitivity Panel', desc: "Identify hidden triggers affecting your dog's health"},
                {title: 'Custom Meal Plan & Recipes', desc: "Tailored to your dog's unique needs and your lifestyle"},
                {title: 'Supplement Recommendations', desc: 'Research-backed supplements for optimal health'},
                {title: 'Fresh Meal Delivery Option', desc: 'Chef-prepared meals delivered to your door (local clients)'},
                {title: 'Quarterly Progress Reviews', desc: 'Ongoing optimization and plan adjustments'},
                {title: 'Direct Access to Christie', desc: 'Email and text support for questions between appointments'},
                {title: 'Exclusive Educational Materials', desc: 'VIP access to advanced nutrition resources'}
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-6 h-6 text-amber-400 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold mb-1">{item.title}</p>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/nutrition-services" className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-[#1e1b4b] px-12 py-5 rounded-full text-xl font-bold hover:from-amber-300 hover:to-amber-500 transition-all shadow-2xl">
              Schedule VIP Consultation
            </Link>
            <p className="text-sm text-gray-300 mt-4">Limited availability • Investment from $1,500</p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-center">
            {["Dual Master's Degrees", '15+ Years Expertise', '500+ Elite Clients', 'Nationwide Service'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-6 h-6 text-amber-400" />
                <span className="text-sm font-semibold text-gray-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-10 border-t-4 border-amber-500">
            <div className="flex justify-center mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <blockquote className="text-center mb-6">
              <p className="text-xl text-[#3c3a47] italic leading-relaxed mb-4">
                "Christie didn't just create a meal plan—she transformed our dog's life. After years of mysterious symptoms that stumped multiple vets, Christie identified the nutritional imbalances within weeks. The attention to detail and ongoing support have been worth every penny."
              </p>
              <cite className="text-[#666666] font-semibold not-italic">— Sarah M., Premium Client</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <Image src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg" alt="Beef and Sweet Potato Bowl" width={2560} height={1707} className="rounded-md" priority />
              <Image src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg" alt="Chicken Superfood Board" width={2560} height={1716} className="rounded-md" />
            </div>
            <div className="space-y-10 lg:pt-20">
              <h2 className="text-[43px] font-normal leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>Doggy Farm Kitchens weren't a thing ~ until now!</h2>
              {[
                {title: 'Farm-Fresh & Sustainably Sourced', desc: 'Highest-quality ingredients from our own farms and trusted partners—because your pet deserves the best.'},
                {title: 'Nutritionist-Formulated, Handcrafted', desc: 'Created by an Animal Nutritionist and prepared in our commercial farm kitchen using advanced animal science.'},
                {title: 'Whole-Body Wellness', desc: 'Our meals support overall health, boost immunity, and help your dog thrive from the inside out.'}
              ].map((feature, i) => (
                <div key={i}>
                  <h4 className="mb-4 text-[18px] font-semibold text-[#3c3a47]">{feature.title}</h4>
                  <p className="text-[15px] italic leading-relaxed text-[#3c3a47]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-[60px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
          <blockquote className="mb-8 text-[18px] italic leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            I do not try to compete with big box companies. What we offer is specialized nutrition. We listen, and do not use computer generated responses to determine what your special dog needs. Because every dog is different.
          </blockquote>
          <p className="text-[15px] font-semibold text-[#3c3a47]">– Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist</p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 px-4 py-12">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>Variation D: The Premium Experience</h2>
          <p className="text-lg mb-6">This approach positions Waggin Meals as a luxury, comprehensive nutrition service for high-end clients who want white-glove care and are willing to invest significantly in their dog's health.</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Best For</h3>
              <p className="text-sm">High-end clients wanting premium concierge service</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Emotional Appeal</h3>
              <p className="text-sm">Exclusivity, luxury, and comprehensive care</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Primary CTA</h3>
              <p className="text-sm">Schedule VIP Consultation</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
