import Link from 'next/link';
import { ComplianceBanner } from '@/components/compliance-banner';
import Image from 'next/image';
import { BookOpen, ShoppingCart, GraduationCap, Check, Star } from 'lucide-react';

export default function TripleThreatFullPage() {
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

      <ComplianceBanner />

      {/* HERO: VARIATION B - THE TRIPLE THREAT */}
      <section className="relative bg-gradient-to-br from-[#f8f9fa] via-white to-[#fef7e8] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#a5b5eb] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#fbbf24] rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#a5b5eb]/10 border border-[#a5b5eb]/30 rounded-full px-5 py-2 mb-6">
              <Star className="w-4 h-4 text-[#a5b5eb] mr-2" />
              <span className="text-sm font-semibold text-[#a5b5eb]">Complete Pet Nutrition Solutions</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Expert Guidance.{' '}
              <span className="text-[#a5b5eb]">Prepared Meals.</span>
              <br />
              <span className="text-[#f59e0b]">Science-Based Education.</span>
            </h1>

            <p className="text-xl text-[#666666] mb-10 leading-relaxed max-w-4xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              From personalized nutrition consultations to ready-made fresh meals and educational resources—
              <strong> everything you need to optimize your dog's health.</strong>
            </p>

            <div className="inline-flex items-center bg-white rounded-full shadow-lg px-8 py-4 mb-12 border border-gray-100">
              <div className="text-center">
                <p className="text-lg font-semibold text-[#3c3a47]">Christie A. Willett, M.A., M.S.</p>
                <p className="text-sm text-[#a5b5eb]">Canine Integrative Animal Nutritionist</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {icon: BookOpen, color: '#a5b5eb', title: 'Expert Consultations', desc: "One-on-one nutrition consultations tailored to your dog's unique health needs, sensitivities, and goals.", points: ['Custom nutrition plans', 'Food sensitivity testing', 'Ongoing support', 'Virtual or in-person'], cta: 'Book Consultation', href: '/nutrition-services'},
              {icon: ShoppingCart, color: '#10b981', title: 'Fresh Prepared Meals', desc: 'Nutritionally balanced, locally-sourced fresh meals delivered to your door—no prep work required.', points: ['Human-grade ingredients', 'Balanced by nutritionist', 'Fresh, never frozen', 'Local delivery available'], cta: 'Shop Fresh Meals', href: '/shop'},
              {icon: GraduationCap, color: '#f59e0b', title: 'Education & Resources', desc: 'Free guides, calculators, and science-based resources to help you make informed nutrition decisions.', points: ['Fresh food feeding guide', 'Feeding calculator', 'Science-based articles', 'Events & workshops'], cta: 'Access Resources', href: '/resources'}
            ].map((service, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow" style={{borderTop: `4px solid ${service.color}`}}>
                <div className="w-16 h-16 bg-opacity-10 rounded-full flex items-center justify-center mb-6" style={{backgroundColor: service.color + '20'}}>
                  <service.icon className="w-8 h-8" style={{color: service.color}} />
                </div>
                <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4">{service.title}</h3>
                <p className="text-[15px] text-[#666666] mb-6 leading-relaxed">{service.desc}</p>
                <ul className="space-y-3 mb-8">
                  {service.points.map((point, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#666666]">{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={service.href} className="block w-full text-white text-center px-6 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg" style={{backgroundColor: service.color}}>
                  {service.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[{num: '500+', label: 'Dogs Helped'}, {num: '15+', label: 'Years Experience'}, {num: '2', label: "Master's Degrees"}, {num: '95%', label: 'Satisfaction Rate'}].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>{stat.num}</div>
                  <div className="text-sm text-[#666666]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            {['Certified Nutritionist', 'Science-Based', 'Nationwide Service', 'Local Fresh Meals'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                <span className="text-sm font-semibold text-[#666666]">{item}</span>
              </div>
            ))}
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

      <section className="bg-white px-4 py-16">
        <h2 className="text-center text-[35px] font-semibold text-[#333333] mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>Happy Customers & Waggin Tails</h2>
        <div className="mx-auto max-w-[1080px] grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {quote: "\"Our dog Maisy absolutely devours the fresh meals that Christie prepares. Can't recommend her enough.\"", author: 'Matt Wolfe + Maisy'},
            {quote: '"Christie is so helpful, kind & very knowledgeable about canine nutrition!"', author: 'Elizabeth Joslin'},
            {quote: '"My dogs love this food!! I know both are getting the best quality ingredients."', author: 'Amber Munoz'},
            {quote: '"Top notch, healthiest possible dog meals! The new location is fantastic!!"', author: 'Thom Slater'}
          ].map((t, i) => (
            <div key={i} className="bg-white p-6">
              <div className="mb-4 text-[48px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
              <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47]">{t.quote}</p>
              <p className="text-[14px] font-semibold text-[#3c3a47]">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-12">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>Variation B: The Triple Threat</h2>
          <p className="text-lg mb-6">This approach showcases all three revenue streams equally—consultations, meals, and education—giving visitors multiple entry points based on their needs.</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Best For</h3>
              <p className="text-sm">All customer segments seeking versatile solutions</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Emotional Appeal</h3>
              <p className="text-sm">Comprehensive solution for every nutrition need</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Primary CTA</h3>
              <p className="text-sm">Multiple CTAs for different entry points</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
