import Image from 'next/image';
import Link from 'next/link';

export default function PuppiesPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Puppy Nutrition
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Give your puppy the best start in life with proper nutrition
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Puppies have unique nutritional needs to support their rapid growth and development. The first year of
              your puppy's life sets the foundation for their long-term health. Fresh, whole-food nutrition provides
              essential nutrients in their most bioavailable forms.
            </p>
          </div>
        </div>
      </section>

      {/* Why Fresh Food for Puppies */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why Fresh Food for Puppies?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                🦴
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Supports Growth
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                High-quality proteins and balanced nutrients support healthy bone, muscle, and organ development
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                🧠
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Brain Development
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                DHA from quality protein sources supports cognitive function and trainability
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-16 h-16 bg-[#8FAE8F] rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                🛡️
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Immune System
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Natural vitamins and minerals help build a strong immune foundation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritional Requirements */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Key Nutritional Requirements for Puppies
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Protein (22-32% of diet)
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Essential for muscle development and growth. Sources: chicken, turkey, beef, fish, eggs
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Fat (8-15% of diet)
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Provides concentrated energy and supports brain development. Sources: salmon oil, chicken fat, egg yolks
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Calcium & Phosphorus (Balanced 1:1 to 2:1 ratio)
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Critical for bone development. Sources: bone meal, eggshells, dairy (if tolerated)
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                DHA
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Omega-3 fatty acid for brain and eye development. Sources: fish, fish oil
              </p>
            </div>

            <div className="border-l-4 border-[#8FAE8F] pl-6 py-2">
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Vitamins & Minerals
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Full spectrum from whole foods including organ meats, vegetables, and fruits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feeding Guidelines */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Puppy Feeding Guidelines
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feeding Frequency by Age
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#8FAE8F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>6-12 weeks:</strong>
                    <span className="text-[#666666] ml-2" style={{ fontFamily: "'Poppins', sans-serif" }}>4 meals per day</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#8FAE8F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>3-6 months:</strong>
                    <span className="text-[#666666] ml-2" style={{ fontFamily: "'Poppins', sans-serif" }}>3 meals per day</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#8FAE8F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>6-12 months:</strong>
                    <span className="text-[#666666] ml-2" style={{ fontFamily: "'Poppins', sans-serif" }}>2 meals per day</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#8FAE8F] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong className="text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>12+ months:</strong>
                    <span className="text-[#666666] ml-2" style={{ fontFamily: "'Poppins', sans-serif" }}>1-2 meals per day</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-[#3c3a47] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Portion Sizes
              </h3>
              <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feed approximately 2.5-3% of expected adult body weight, divided across meals:
              </p>
              <ul className="space-y-3">
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Small breeds:</strong> May need up to 5% of body weight
                </li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Medium breeds:</strong> 2.5-3% of body weight
                </li>
                <li className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Large breeds:</strong> 2-2.5% of body weight
                </li>
              </ul>
              <p className="text-[13px] text-[#666666] mt-4 italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                *Adjust based on activity level, growth rate, and body condition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Common Puppy Feeding Mistakes to Avoid
          </h2>

          <div className="space-y-4">
            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Overfeeding
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Excess calories can lead to rapid growth and developmental orthopedic diseases, especially in large breeds
              </p>
            </div>

            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Calcium Supplementation Without Guidance
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Improper calcium can cause skeletal abnormalities. Work with a pet nutritionist for proper balance
              </p>
            </div>

            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Inconsistent Feeding Times
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Puppies need regular meal schedules for proper digestion and house training
              </p>
            </div>

            <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] p-4 rounded">
              <h3 className="font-semibold text-[#856404] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ⚠️ Switching Foods Too Quickly
              </h3>
              <p className="text-[14px] text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Gradual transitions over 7-10 days prevent digestive upset
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Get a Custom Puppy Nutrition Plan
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Every puppy is unique. Schedule a consultation to create a personalized feeding plan that supports
            your puppy's specific growth needs, breed characteristics, and health requirements.
          </p>
          <Link
            href="/nutrition-services"
            className="bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg inline-block"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
