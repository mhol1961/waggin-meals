import Link from 'next/link';

export default function SupplementationPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Premium Supplementation
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Boost your dog's nutrition with science-backed supplements
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              While our fresh meals provide excellent nutrition, targeted supplementation can address specific health needs.
              We recommend PicoPets supplements for their quality and bioavailability.
            </p>
          </div>
        </div>
      </section>

      {/* PicoPets Brand Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Why PicoPets?
              </h2>
              <p className="text-[16px] leading-relaxed text-[#666666] max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
                PicoPets uses advanced pico-technology to deliver nutrients at the cellular level, ensuring maximum absorption
                and effectiveness. These supplements are veterinarian-formulated and backed by science.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-[#f8f9fa] rounded-lg">
                <div className="mb-4 flex justify-center">
                  <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Pico-Technology
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Ultra-small particles for superior absorption
                </p>
              </div>

              <div className="text-center p-6 bg-[#f8f9fa] rounded-lg">
                <div className="mb-4 flex justify-center">
                  <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Vet-Formulated
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Created by veterinary nutritionists
                </p>
              </div>

              <div className="text-center p-6 bg-[#f8f9fa] rounded-lg">
                <div className="mb-4 flex justify-center">
                  <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  All-Natural
                </h3>
                <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  No artificial colors, flavors, or fillers
                </p>
              </div>
            </div>

            {/* Discount Code */}
            <div className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] rounded-lg p-6 text-center">
              <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Exclusive Waggin Meals Discount
              </h3>
              <p className="text-white mb-4 text-[15px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Use code at checkout for special pricing
              </p>
              <div className="bg-white rounded-lg py-4 px-8 inline-block">
                <span className="text-3xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Courier New', monospace" }}>
                  WAGGIN10
                </span>
              </div>
              <p className="text-white mt-4 text-[13px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                10% off your PicoPets order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Supplements Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Recommended Supplements
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Joint Support */}
            <div className="bg-[#f8f9fa] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-[#a5b5eb] p-6 text-center">
                <svg className="h-16 w-16 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zm-95 81l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                </svg>
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Joint Support
                </h3>
              </div>
              <div className="p-6">
                <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Glucosamine, chondroitin, and MSM for healthy joints and mobility. Ideal for active dogs and seniors.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Reduces inflammation
                  </li>
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Supports cartilage health
                  </li>
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Improves mobility
                  </li>
                </ul>
              </div>
            </div>

            {/* Digestive Support */}
            <div className="bg-[#f8f9fa] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-[#a5b5eb] p-6 text-center">
                <svg className="h-16 w-16 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                </svg>
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Digestive Support
                </h3>
              </div>
              <div className="p-6">
                <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Probiotics and digestive enzymes to support gut health and nutrient absorption.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Balances gut microbiome
                  </li>
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Reduces digestive upset
                  </li>
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Boosts immune function
                  </li>
                </ul>
              </div>
            </div>

            {/* Skin & Coat */}
            <div className="bg-[#f8f9fa] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="bg-[#a5b5eb] p-6 text-center">
                <svg className="h-16 w-16 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
                </svg>
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Skin & Coat
                </h3>
              </div>
              <div className="p-6">
                <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Omega-3 fatty acids, biotin, and vitamins for a healthy, shiny coat and skin.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Reduces shedding
                  </li>
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Soothes itchy skin
                  </li>
                  <li className="text-[14px] text-[#666666] flex items-start" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <svg className="h-5 w-5 text-[#a5b5eb] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    Promotes shine
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Help Choosing?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Not sure which supplements are right for your dog? Schedule a consultation with Christie to create
            a personalized supplement plan based on your dog's unique needs.
          </p>
          <Link
            href="/nutrition-services"
            className="bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg inline-block"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book a Nutrition Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
