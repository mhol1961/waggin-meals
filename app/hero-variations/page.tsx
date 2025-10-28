import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hero Section Variations | Waggin Meals',
  description: 'Compare 10 different hero section designs for the Waggin Meals home page',
};

export default function HeroVariationsIndex() {
  const variations = [
    {
      id: 'diagnostic-detective',
      title: 'Variation A: The Diagnostic Detective',
      description: "For desperate pet owners with complex cases vets can't solve",
      target: 'Premium clients with urgent, mysterious health issues',
      cta: 'Book Diagnostic Consultation',
    },
    {
      id: 'triple-threat',
      title: 'Variation B: The Triple Threat',
      description: 'Showcases consultations, meals, and education equally',
      target: 'All customer segments - versatile approach',
      cta: 'Multiple CTAs for different needs',
    },
    {
      id: 'science-educator',
      title: 'Variation C: The Science Educator',
      description: 'For educated DIY owners who want to learn',
      target: 'Knowledge-seekers, empowerment-focused',
      cta: 'Access Free Resources / Book Consultation',
    },
    {
      id: 'premium-experience',
      title: 'Variation D: The Premium Experience',
      description: 'Luxury comprehensive nutrition service',
      target: 'High-end clients wanting white-glove service',
      cta: 'Schedule VIP Consultation',
    },
    {
      id: 'biome-color-palette',
      title: 'Variation E: Biome Color Palette',
      description: 'Gut health focus with biome branding',
      target: 'Science-minded pet owners interested in microbiome',
      cta: 'Explore Gut Health Solutions',
    },
    {
      id: 'biome-experience',
      title: 'Variation F: Biome Experience',
      description: 'Immersive gut health and biome approach',
      target: 'Pet owners seeking holistic health transformation',
      cta: 'Start Biome Journey',
    },
    {
      id: 'waggin-biome-fusion',
      title: 'Variation G: Waggin Biome Fusion',
      description: 'Combines Waggin Meals branding with biome science',
      target: 'Customers wanting proven science + brand trust',
      cta: 'Discover the Science',
    },
    {
      id: 'waggin-holistic-experience',
      title: 'Variation H: Waggin Holistic Experience',
      description: 'Complete wellness approach with Waggin Meals',
      target: 'Pet owners seeking comprehensive health solutions',
      cta: 'Begin Wellness Journey',
    },
    {
      id: 'ultimate-homepage',
      title: 'Variation I: Ultimate Homepage ⭐',
      description: 'Best elements combined: "When vets can\'t find answers" hook, palette visualization, GHL chat integration, Christie\'s credentials',
      target: 'All customer segments - comprehensive approach',
      cta: 'Book Free Consultation',
    },
    {
      id: 'luxury-expert-homepage',
      title: 'Variation J: Luxury Expert Homepage ⭐ NEW',
      description: 'Compact logo (40% smaller), calculator section with side-by-side quiz, rotating problem text, all features from Variation I',
      target: 'Luxury clients wanting expert help with calculator tool',
      cta: 'Calculate Your Dog\'s Needs / Book Consultation',
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Hero Section Variations
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Compare 10 different hero section designs for the Waggin Meals home page
          </p>
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-yellow-50 border-b-4 border-yellow-400 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            How to Use This Page
          </h2>
          <ol className="space-y-2 text-yellow-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Click on each variation below to see it live in your browser</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Each variation is a complete, functional hero section you can interact with</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Test on mobile by resizing your browser window</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Share the links with Christie to get her feedback</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">5.</span>
              <span>We can mix elements from different variations to create the perfect final version</span>
            </li>
          </ol>
        </div>
      </section>

      {/* Variations Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {variations.map((variation, index) => (
              <Link
                key={variation.id}
                href={`/hero-variations/${variation.id}`}
                className="bg-white border-2 border-[#e0e0e0] rounded-lg p-8 hover:shadow-2xl hover:border-[#a5b5eb] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <svg className="w-6 h-6 text-[#a5b5eb] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-semibold text-[#3c3a47] mb-3 group-hover:text-[#a5b5eb] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {variation.title}
                </h3>

                <p className="text-[15px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {variation.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <strong>Target:</strong> {variation.target}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <strong>Primary CTA:</strong> {variation.cta}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <span className="text-[#a5b5eb] font-semibold group-hover:underline" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    View Live Demo →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Quick Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7]">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Feature</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Variation A</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Variation B</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Variation C</th>
                  <th className="px-6 py-4 text-left text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Variation D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]">Primary Focus</td>
                  <td className="px-6 py-4 text-[#666666]">Diagnostic Expertise</td>
                  <td className="px-6 py-4 text-[#666666]">All Services</td>
                  <td className="px-6 py-4 text-[#666666]">Education</td>
                  <td className="px-6 py-4 text-[#666666]">Premium Service</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]">Emotional Appeal</td>
                  <td className="px-6 py-4 text-[#666666]">Hope for desperate owners</td>
                  <td className="px-6 py-4 text-[#666666]">Comprehensive solution</td>
                  <td className="px-6 py-4 text-[#666666]">Empowerment</td>
                  <td className="px-6 py-4 text-[#666666]">Exclusivity</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]">Best For</td>
                  <td className="px-6 py-4 text-[#666666]">Complex cases</td>
                  <td className="px-6 py-4 text-[#666666]">All customers</td>
                  <td className="px-6 py-4 text-[#666666]">DIY owners</td>
                  <td className="px-6 py-4 text-[#666666]">High-end clients</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]">Price Point</td>
                  <td className="px-6 py-4 text-[#666666]">Premium</td>
                  <td className="px-6 py-4 text-[#666666]">Flexible</td>
                  <td className="px-6 py-4 text-[#666666]">Entry-level</td>
                  <td className="px-6 py-4 text-[#666666]">Luxury</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-[#3c3a47]">Conversion Goal</td>
                  <td className="px-6 py-4 text-[#666666]">Book consultation</td>
                  <td className="px-6 py-4 text-[#666666]">Multiple paths</td>
                  <td className="px-6 py-4 text-[#666666]">Engage with content</td>
                  <td className="px-6 py-4 text-[#666666]">VIP booking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="px-4 py-12 text-center">
        <Link
          href="/"
          className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          ← Back to Current Home Page
        </Link>
      </section>
    </main>
  );
}
