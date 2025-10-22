import Link from 'next/link';
import Image from 'next/image';

export default function DiagnosticDetectiveFullPage() {
  return (
    <main className="bg-white">
      {/* Simplified Navigation */}
      <nav className="bg-white shadow-sm py-4 px-4 border-b border-gray-200">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo-waggin-meals.png" alt="Waggin Meals" className="h-12 w-auto" />
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/hero-variations" className="text-[#666666] hover:text-[#a5b5eb] font-semibold">← Back to Variations</Link>
            <Link href="/" className="text-[#666666] hover:text-[#a5b5eb]">Current Home</Link>
          </div>
        </div>
      </nav>

      {/* FDA Disclaimer */}
      <section className="bg-[#f0f7ff] border-b-2 border-[#a5b5eb] px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-[16px] font-semibold text-[#3c3a47] mb-2 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our Promise
          </h3>
          <p className="text-[14px] text-[#666666] leading-relaxed mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an Animal Nutritionist to meet <strong>AAFCO standards for dog(s) of all ages</strong>.
          </p>
          <p className="text-[13px] text-[#666666] leading-relaxed text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong>Important Info:</strong> Our meals are specially formulated for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your vet for any health-related decisions about your dog.
          </p>
        </div>
      </section>

      {/* HERO: VARIATION A - THE DIAGNOSTIC DETECTIVE */}
      <section className="relative bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8f4fb] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#a5b5eb] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#c5d4f7] rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-semibold text-red-700">For Dogs Suffering from Unexplained Symptoms</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
                When Veterinarians Can't Find Answers,{' '}
                <span className="text-[#a5b5eb]">We Look at Nutrition</span>
              </h1>

              <p className="text-xl text-[#666666] mb-8 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Christie Willett, M.S., Canine Integrative Animal Nutritionist, has <strong className="text-[#3c3a47]">diagnosed conditions other professionals missed</strong>—using advanced nutrition science and food sensitivity testing.
              </p>

              <div className="space-y-3 mb-8">
                {['Solved cases that stumped veterinarians and specialists', 'Advanced testing for food sensitivities and nutritional imbalances', 'Dual Master\'s degrees in nutrition science'].map((point, i) => (
                  <div key={i} className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[16px] text-[#3c3a47]"><strong>{point.split(' ')[0]}</strong> {point.substring(point.indexOf(' '))}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/nutrition-services" className="bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg text-center">
                  Book Diagnostic Consultation
                </Link>
                <Link href="/testimonials" className="bg-white text-[#a5b5eb] border-2 border-[#a5b5eb] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#a5b5eb] hover:text-white transition-colors shadow-lg text-center">
                  See Success Stories
                </Link>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-sm text-yellow-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Priority Booking:</strong> Limited consultation slots available this month
                </p>
              </div>
            </div>

            {/* Right Column - Credentials */}
            <div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-[#a5b5eb] rounded-full flex items-center justify-center mr-6">
                    <span className="text-3xl font-bold text-white">CW</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[#3c3a47] mb-1">Christie A. Willett</h3>
                    <p className="text-[15px] text-[#a5b5eb] font-semibold mb-1">M.A., M.S.</p>
                    <p className="text-sm text-[#666666]">Canine Integrative Animal Nutritionist</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    {icon: '🎓', text: 'Master of Arts in Animal Behavior & Nutrition'},
                    {icon: '🔬', text: 'Master of Science in Nutrition Science'},
                    {icon: '✅', text: 'Certified Canine Integrative Animal Nutritionist'}
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-xl mr-3">{item.icon}</span>
                      <span className="text-sm text-[#666666]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[{num: '500+', label: 'Dogs Helped'}, {num: '15+', label: 'Years Experience'}, {num: '95%', label: 'Satisfaction'}].map((stat, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg p-4 text-center">
                    <div className="text-3xl font-bold text-[#a5b5eb] mb-1">{stat.num}</div>
                    <div className="text-xs text-[#666666]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Images */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <Image src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg" alt="Beef and Sweet Potato Bowl" width={2560} height={1707} className="rounded-md" priority />
              <Image src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg" alt="Chicken Superfood Board" width={2560} height={1716} className="rounded-md" />
            </div>
            <div className="space-y-10 lg:pt-20">
              <h2 className="text-[43px] font-normal leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>Doggy Farm Kitchens weren&apos;t a thing ~ until now!</h2>
              {[
                {title: 'Farm-Fresh & Sustainably Sourced', desc: 'Highest-quality ingredients from our own farms and trusted partners—because your pet deserves the best.'},
                {title: 'Nutritionist-Formulated, Handcrafted', desc: 'Created by an Animal Nutritionist and prepared in our commercial farm kitchen using advanced animal science.'},
                {title: 'Whole-Body Wellness', desc: 'Our meals support overall health, boost immunity, and help your dog thrive from the inside out.'}
              ].map((feature, i) => (
                <div key={i}>
                  <h4 className="mb-4 text-[18px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>{feature.title}</h4>
                  <p className="text-[15px] italic leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-[60px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
          <blockquote className="mb-8 text-[18px] italic leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            I do not try to compete with big box companies. What we offer is specialized nutrition. We listen, and do not use computer generated responses to determine what your special dog needs. Because every dog is different.
          </blockquote>
          <p className="text-[15px] font-semibold text-[#3c3a47]">– Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-16">
        <h2 className="text-center text-[35px] font-semibold text-[#333333] mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>Happy Customers & Waggin Tails</h2>
        <div className="mx-auto max-w-[1080px] grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {quote: '"Our dog Maisy absolutely devours the fresh meals that Christie prepares. Can\'t recommend her enough."', author: 'Matt Wolfe + Maisy'},
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

      {/* Variation Info Footer */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-12">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>Variation A: The Diagnostic Detective</h2>
          <p className="text-lg mb-6">This approach targets desperate pet owners with complex cases that vets couldn't solve, positioning Christie as the diagnostic expert who solves mysterious health issues.</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Best For</h3>
              <p className="text-sm">Premium clients with urgent, mysterious health issues</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Emotional Appeal</h3>
              <p className="text-sm">Hope for desperate owners seeking answers</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Primary CTA</h3>
              <p className="text-sm">Book Diagnostic Consultation</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
