import Image from 'next/image';
import Link from 'next/link';

export default function FoodSensitivitiesPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Food Sensitivities Testing
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Identify what's causing your dog's discomfort with 5Strands testing
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Does your dog experience chronic itching, digestive issues, or unexplained discomfort? Food sensitivities
              could be the culprit. 5Strands affordable pet testing helps you identify problem ingredients so you can
              eliminate them from your dog's diet.
            </p>
          </div>
        </div>
      </section>

      {/* 5Strands Logo Section */}
      <section className="bg-[#f8f9fa] px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-8 flex justify-center">
              <Image
                src="/images/5 Strands.webp"
                alt="5Strands Pet Testing"
                width={400}
                height={200}
                className="h-auto w-auto max-w-[300px]"
              />
            </div>
            <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              What is 5Strands Testing?
            </h2>
            <p className="text-[16px] leading-relaxed text-[#666666] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              5Strands offers at-home testing kits that analyze your dog's hair sample to identify temporary
              intolerances to over 300 food items and environmental factors. Results are delivered within 7-10 days,
              giving you a clear roadmap for an elimination diet.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            How 5Strands Testing Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Order Kit
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Use our QR code or link to order your 5Strands test kit
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Collect Sample
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Follow simple instructions to collect a small hair sample from your dog
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Mail & Wait
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Send sample to the lab and receive results in 7-10 business days
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Get Results
              </h3>
              <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Review detailed report of food sensitivities and elimination recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - QR Code */}
              <div className="bg-[#a5b5eb] p-12 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Order Your Test Kit
                </h3>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <Image
                    src="/images/5 Strands food sensitivities.png"
                    alt="5Strands QR Code"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-white mt-6 text-center text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Scan with your phone camera to order
                </p>
                <div className="mt-8 w-full">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center mb-4">
                    <p className="text-white text-sm mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Use Discount Code:
                    </p>
                    <div className="bg-white rounded-lg py-3 px-6 inline-block">
                      <span className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Courier New', monospace" }}>
                        Wagginmeals
                      </span>
                    </div>
                  </div>
                  <a
                    href="http://www.5strands.com/#Wagginmeals"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-white text-[#a5b5eb] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Order 5Strands Test →
                  </a>
                </div>
              </div>

              {/* Right Side - Benefits */}
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Why Test for Food Sensitivities?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#a5b5eb] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Stop the Guessing Game</strong>
                      <p className="text-[14px] text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Get clear answers instead of trial and error with different foods
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#a5b5eb] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Relieve Discomfort</strong>
                      <p className="text-[14px] text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Reduce itching, hot spots, ear infections, and digestive issues
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#a5b5eb] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Customize Meals</strong>
                      <p className="text-[14px] text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Work with us to create meals that avoid your dog's specific triggers
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#a5b5eb] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>Affordable & Non-Invasive</strong>
                      <p className="text-[14px] text-[#666666] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Simple hair test - no blood draw or vet visit required
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Tested Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            What Does 5Strands Test?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Food Intolerances
              </h3>
              <p className="text-[14px] text-[#666666] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Tests 300+ items including:
              </p>
              <ul className="space-y-2">
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Proteins (chicken, beef, fish)</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Grains (wheat, rice, corn)</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Vegetables & fruits</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Additives & preservatives</li>
              </ul>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Environmental Factors
              </h3>
              <p className="text-[14px] text-[#666666] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Includes testing for:
              </p>
              <ul className="space-y-2">
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Pollen & grasses</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Dust & mold</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Fabric materials</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Cleaning products</li>
              </ul>
            </div>

            <div className="bg-[#f8f9fa] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Nutritional Imbalances
              </h3>
              <p className="text-[14px] text-[#666666] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Identifies deficiencies in:
              </p>
              <ul className="space-y-2">
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Vitamins (A, B, C, D, E)</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Minerals (zinc, iron, calcium)</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Amino acids</li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>• Fatty acids</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Get Results-Driven Meal Planning
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            After receiving your 5Strands results, schedule a consultation with Christie to create a customized
            meal plan that avoids your dog's sensitivities while ensuring complete nutrition.
          </p>
          <Link
            href="/nutrition-services"
            className="bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg inline-block"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
