import Image from 'next/image';
import Link from 'next/link';

export default function FeedingMadeSimplePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Feeding Made Simple
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Everything you need to know about feeding your dog fresh, nutritious meals
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Switching to fresh food doesn't have to be complicated. We've made it simple to give your dog
              the nutrition they deserve. Follow our easy guide to get started.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            4 Simple Steps to Fresh Feeding
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Calculate Portions
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Use our feeding calculator to determine the right amount for your dog based on weight, activity level, and body condition.
              </p>
              <Link
                href="/feeding-calculator"
                className="inline-block text-[#8FAE8F] font-semibold hover:text-[#6d8c6d] text-[14px]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Try Our Calculator →
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Transition Gradually
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Mix Waggin Meals with your current food over 7-10 days. Start with 25% fresh food, increasing by 25% every 2-3 days.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Store Properly
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Keep meals frozen until ready to use. Thaw in refrigerator for 24 hours. Once thawed, serve within 3-4 days.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  4
                </div>
                <h3 className="text-xl font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Monitor & Adjust
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Watch for positive changes: firmer stools, shinier coat, more energy. Adjust portions as needed to maintain ideal weight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Schedule Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            7-Day Transition Schedule
          </h2>

          <div className="bg-[#f8f9fa] rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-24 flex-shrink-0">
                  <span className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Days 1-2:
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-[#8FAE8F] rounded-full relative">
                    <span className="absolute left-2 top-1 text-white text-xs font-semibold">25% Fresh</span>
                    <span className="absolute right-2 top-1 text-[#666666] text-xs font-semibold">75% Current Food</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-24 flex-shrink-0">
                  <span className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Days 3-4:
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-[#8FAE8F] rounded-full relative">
                    <span className="absolute left-2 top-1 text-white text-xs font-semibold">50% Fresh</span>
                    <span className="absolute right-2 top-1 text-[#666666] text-xs font-semibold">50% Current Food</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-24 flex-shrink-0">
                  <span className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Days 5-6:
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-[#8FAE8F] rounded-full relative">
                    <span className="absolute left-2 top-1 text-white text-xs font-semibold">75% Fresh</span>
                    <span className="absolute right-2 top-1 text-[#666666] text-xs font-semibold">25% Current Food</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-24 flex-shrink-0">
                  <span className="font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Day 7+:
                  </span>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-[#8FAE8F] rounded-full relative">
                    <span className="absolute left-1/2 transform -translate-x-1/2 top-1 text-white text-xs font-semibold">100% Waggin Meals!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <strong className="text-[#3c3a47]">Important:</strong> If your dog experiences digestive upset at any point, slow down the transition. Some dogs may need 10-14 days to fully adjust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feeding Tips Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Pro Feeding Tips
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#8FAE8F]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Consistent Schedule
              </h3>
              <p className="text-[14px] leading-relaxed text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feed at the same times each day. Most adult dogs do well with 2 meals daily (morning and evening).
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#8FAE8F]" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Room Temperature
              </h3>
              <p className="text-[14px] leading-relaxed text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Let food sit for 10-15 minutes after refrigeration. Dogs prefer food at room temperature, not cold.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#8FAE8F]" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M142.4 21.9c5.6 16.8-3.5 34.9-20.2 40.5L96 71.1V192c0 53 43 96 96 96s96-43 96-96V71.1l-26.1-8.7c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l26.1 8.7C334.4 19.1 352 43.5 352 71.1V192c0 77.2-54.6 141.6-127.3 156.7C231 404.6 278.4 448 336 448c61.9 0 112-50.1 112-112V265.3c-28.3-12.3-48-40.5-48-73.3c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V336c0 97.2-78.8 176-176 176c-92.9 0-168.9-71.9-175.5-163.1C87.2 334.2 32 269.6 32 192V71.1c0-27.5 17.6-52 43.8-60.7l26.1-8.7c16.8-5.6 34.9 3.5 40.5 20.2zM480 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fresh Water Always
              </h3>
              <p className="text-[14px] leading-relaxed text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fresh, clean water should be available at all times. Change water daily and clean the bowl regularly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Personalized Help?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Every dog is unique. For customized feeding recommendations based on your dog's specific needs,
            schedule a consultation with Christie, our Canine Integrative Animal Nutritionist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nutrition-services"
              className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Book a Consultation
            </Link>
            <Link
              href="/feeding-calculator"
              className="bg-white border-2 border-[#8FAE8F] text-[#8FAE8F] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Use Feeding Calculator
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
