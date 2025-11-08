import Image from 'next/image';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Free Resources
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Downloadable guides to help you feed your dog better
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[18px] leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Download our comprehensive guides to learn the fundamentals of fresh food feeding, proper portion
              sizing, and transitioning your dog to a healthier diet. These resources are designed to give you
              the confidence and knowledge to make the best nutritional choices for your pet.
            </p>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Fresh Food Feeding Guide */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-[#8FAE8F] px-8 py-12 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  📘
                </div>
                <h2 className="text-3xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Fresh Food Feeding Guide
                </h2>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  What's Inside:
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Why fresh food is better than kibble
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Essential nutrients dogs need
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Building balanced meals at home
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Safe and unsafe foods for dogs
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      7-day transition plan
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Sample meal recipes
                    </span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <Link
                    href="/guides/fresh-food-guide"
                    className="block w-full bg-[#8FAE8F] text-white text-center px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Read Online Guide
                  </Link>
                  <a
                    href="/downloads/fresh-food-feeding-guide.pdf"
                    download
                    className="block w-full bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] text-center px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors shadow-lg"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Download PDF
                  </a>
                </div>
                <p className="text-[12px] text-[#999999] text-center mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Comprehensive guide • No email required
                </p>
              </div>
            </div>

            {/* Portion Size & Feeding Guide */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-[#6d8c6d] px-8 py-12 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  📊
                </div>
                <h2 className="text-3xl font-normal text-white mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Portion Size & Feeding Guide
                </h2>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  What's Inside:
                </h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Calculate your dog's ideal portions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Feeding by body weight & activity level
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Adjusting for puppies, seniors, and athletes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Body condition scoring guide
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Meal frequency recommendations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-[#8FAE8F] mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Troubleshooting weight issues
                    </span>
                  </li>
                </ul>
                <a
                  href="/downloads/portion-feeding-guide.pdf"
                  download
                  className="block w-full bg-[#8FAE8F] text-white text-center px-6 py-4 rounded-lg text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Download Guide (PDF)
                </a>
                <p className="text-[12px] text-[#999999] text-center mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Free 18-page guide • No email required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            More Helpful Resources
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/feeding-calculator" className="bg-[#f8f9fa] rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">🧮</div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feeding Calculator
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Calculate your dog's daily calorie needs and portion sizes
              </p>
            </Link>

            <Link href="/feeding-made-simple" className="bg-[#f8f9fa] rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">📖</div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Feeding Made Simple
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Step-by-step guide to transitioning to fresh food
              </p>
            </Link>

            <Link href="/food-sensitivities" className="bg-[#f8f9fa] rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4 text-center">🔬</div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Food Sensitivity Testing
              </h3>
              <p className="text-[14px] text-[#666666] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Identify food triggers with 5Strands testing
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Books & Education */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Recommended Books & Education
            </h2>
            <p className="text-[16px] text-[#666666] max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Expand your knowledge with these trusted resources that I recommend to all my clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Book 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/beef-sweet-potato-bowl.jpg"
                  alt="The Forever Dog Book"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  The Forever Dog
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  by Dr. Karen Shaw Becker & Rodney Habib
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Groundbreaking science reveals how to optimize your dog's health and longevity through nutrition, environment, and lifestyle choices.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie's Take:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "This book revolutionized how I think about canine nutrition. It's packed with science-backed strategies to help your dog live longer and healthier. A must-read for every dog owner!"
                  </p>
                </div>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#8FAE8F] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View on Amazon →
                </a>
              </div>
            </div>

            {/* Book 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/chicken-superfood-board.jpg"
                  alt="Canine Nutrigenomics Book"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Canine Nutrigenomics
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  by Dr. Jean Dodds & Diana Laverdure
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Discover how food affects your dog's gene expression and learn to use nutrition as medicine to prevent and manage disease.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie's Take:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "This book dives deep into the science of how food influences health at the genetic level. Perfect for owners who want to understand the 'why' behind nutritional recommendations."
                  </p>
                </div>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#8FAE8F] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View on Amazon →
                </a>
              </div>
            </div>

            {/* Book 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/woman-with-white-dog.webp"
                  alt="The Dog Food Recipe Book"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Unlocking the Canine Ancestral Diet
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  by Steve Brown
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Learn about the ancestral diet that dogs evolved to eat and how to recreate those nutritional benefits with modern ingredients.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie's Take:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Steve Brown's approach to balancing homemade diets is brilliant. This book helps you understand the nutritional gaps in common recipes and how to fix them properly."
                  </p>
                </div>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#8FAE8F] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  View on Amazon →
                </a>
              </div>
            </div>

            {/* Online Course */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/beef-sweet-potato-bowl.jpg"
                  alt="Canine Nutrition Course"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Dogs Naturally University
                </h3>
                <p className="text-sm text-[#999999] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Online Canine Nutrition Courses
                </p>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Comprehensive online courses covering fresh feeding, raw diets, supplements, and holistic health approaches taught by experts.
                </p>
                <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                  <p className="text-xs text-[#666666] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie's Take:
                  </p>
                  <p className="text-[13px] text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Their courses are well-structured and evidence-based. Perfect for DIY feeders who want professional-level knowledge. I've taken several of their programs myself!"
                  </p>
                </div>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#8FAE8F] text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Explore Courses →
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              See all of Christie's recommended products and supplements
            </p>
            <Link
              href="/recommended-products"
              className="inline-block bg-white text-[#8FAE8F] border-2 border-[#8FAE8F] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              View All Recommended Products
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Reference Feeding Guides */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Quick Reference Guides
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Quick Feeding Guide */}
            <div className="bg-[#f8f9fa] rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96">
                <Image
                  src="/downloads/quick-feeding-guide.png"
                  alt="Waggin Meals Quick Feeding Guide"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Quick Feeding Guide
                </h3>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Daily feeding amounts by size, storage tips, and nutritional guidelines. Perfect for printing and keeping on your fridge!
                </p>
                <a
                  href="/downloads/quick-feeding-guide.png"
                  download
                  className="block w-full bg-[#8FAE8F] text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Download Image (PNG)
                </a>
              </div>
            </div>

            {/* Weight Management Guide */}
            <div className="bg-[#f8f9fa] rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96">
                <Image
                  src="/downloads/weight-management-guide.png"
                  alt="Dog Weight Management Guide"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#3c3a47] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Weight Management Guide
                </h3>
                <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Visual guide to assess if your dog is underweight, ideal weight, overweight, or obese. Includes body condition descriptions.
                </p>
                <a
                  href="/downloads/weight-management-guide.png"
                  download
                  className="block w-full bg-[#8FAE8F] text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Download Image (PNG)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Personalized Guidance?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            While these guides provide a great foundation, every dog is unique. Schedule a consultation
            to get a customized meal plan tailored to your dog's specific needs, health conditions, and lifestyle.
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
