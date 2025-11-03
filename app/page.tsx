import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Waggin' Meals - Fresh Dog Food & Expert Canine Nutrition Services",
  description: "Premium human-grade, gently cooked dog food crafted by board-certified nutritionist Christie Naquin. Custom meal plans, fresh ingredients, free shipping over $165. Transform your dog's health today.",
  keywords: [
    'fresh dog food',
    'human-grade dog food',
    'gently cooked dog food',
    'canine nutritionist',
    'custom dog meal plans',
    'board-certified pet nutritionist',
    'fresh pet food delivery',
    'dog nutrition services',
    'Christie Naquin',
    'integrative animal nutrition',
  ],
  openGraph: {
    title: "Waggin' Meals - Premium Fresh Dog Food & Nutrition Services",
    description: "Human-grade, gently cooked dog food scientifically formulated by board-certified nutritionist Christie Naquin. Fresh ingredients, custom meal plans, expert nutrition guidance.",
    url: 'https://wagginmeals.com',
    siteName: "Waggin' Meals",
    images: [
      {
        url: 'https://wagginmeals.com/images/logo-waggin-meals.png',
        width: 1200,
        height: 630,
        alt: "Waggin' Meals - Fresh Dog Food",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Waggin' Meals - Fresh Dog Food & Expert Nutrition",
    description: "Premium human-grade, gently cooked dog food by board-certified nutritionist Christie Naquin. Fresh ingredients, custom plans.",
    images: ['https://wagginmeals.com/images/logo-waggin-meals.png'],
  },
  alternates: {
    canonical: 'https://wagginmeals.com',
  },
};

export default function Home() {
  return (
    <main className="bg-white">

      {/* Hero Section - Centered Title */}
      <section className="bg-white px-4 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-[40px] font-normal leading-tight tracking-wide text-black md:text-[32px] sm:text-[24px]" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Waggin Meals Pet Nutrition Co.
          </h1>
          <h5 className="mb-2 text-[15px] font-semibold leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong>Human-Grade &amp; Gently Cooked Dog food &gt; Small Batch Kitchen &gt; Pet Nutrition Services</strong>
          </h5>
          <h5 className="mb-6 text-[15px] font-semibold leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong>Scientifically Formulated</strong> by an Integrative Animal Nutritionist
          </h5>
          <p className="text-[14px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong><em>Free Shipping for </em><em>Orders Over $165.00 - we also offer local delivery &amp; pick up</em></strong>
          </p>
        </div>
      </section>

      {/* Main 2-Column Section */}
      <section className="bg-white px-4 py-8">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* LEFT COLUMN - Product Images */}
            <div className="space-y-8">
              {/* Image 1 - Beef Bowl */}
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                  alt="Beef and Sweet Potato Bowl"
                  width={2560}
                  height={1707}
                  className="h-auto w-full"
                  priority
                />
              </div>

              {/* Image 2 - Chicken Board */}
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                  alt="Chicken Superfood Cake Board"
                  width={2560}
                  height={1716}
                  className="h-auto w-full"
                />
              </div>
            </div>

            {/* RIGHT COLUMN - Content */}
            <div className="space-y-10 lg:pt-20">
              {/* Heading */}
              <div>
                <h2 className="text-[43px] font-normal leading-tight text-black md:text-[32px] sm:text-[24px]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Doggy Farm Kitchens weren't a thing ~ until now!
                </h2>
              </div>

              {/* Feature 1 - Farm-Fresh & Sustainably Sourced */}
              <div>
                <h4 className="mb-4 text-[18px] font-semibold text-[#3c3a47] sm:text-[15px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <svg className="mr-2 inline-block h-5 w-5 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                    <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"/>
                  </svg>
                  Farm-Fresh & Sustainably Sourced
                </h4>
                <p className="text-[15px] italic leading-relaxed text-[#3c3a47] sm:text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong><a href="/about" className="text-[#3c3a47] no-underline hover:text-[#a5b5eb]">Highest-quality ingredients from our own farms and trusted partners—because your pet deserves the best. Shop Now!</a></strong>
                </p>
              </div>

              {/* Feature 2 - Nutritionist-Formulated, Handcrafted */}
              <div>
                <h4 className="mb-4 text-[18px] font-semibold text-[#3c3a47] sm:text-[15px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <svg className="mr-2 inline-block h-5 w-5 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Nutritionist-Formulated, Handcrafted
                </h4>
                <p className="text-[15px] italic leading-relaxed text-[#3c3a47] sm:text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Created by an <strong>Animal Nutritionist</strong> and prepared in our commercial farm kitchen using advanced animal science. <a href="/nutrition-services" className="text-[#3c3a47] no-underline hover:text-[#a5b5eb]" title="Pet Nutrition Services"><strong>We also offer Pet Nutrition Clinics and Consultations.</strong></a>
                </p>
              </div>

              {/* Feature 3 - Whole-Body Wellness */}
              <div>
                <h4 className="mb-4 text-[18px] font-semibold text-[#3c3a47] sm:text-[15px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <svg className="mr-2 inline-block h-5 w-5 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                  </svg>
                  Whole-Body Wellness
                </h4>
                <p className="text-[15px] italic leading-relaxed text-[#3c3a47] sm:text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Our meals support overall health, boost immunity, and help your dog thrive from the inside out. <a href="/about" className="text-[#3c3a47] no-underline hover:text-[#a5b5eb]" title="Contact Us"><strong>Contact us directly with any questions you may have, we will help you build your dogs bowl.</strong></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Nutrition Services Image */}
      <section className="bg-white px-4 py-8">
        <div className="mx-auto max-w-[1080px]">
          <Image
            src="/images/2025/09/Canine-Nutrtion-Services.webp"
            alt="Asheville NC Pet Nutrition Services"
            width={1200}
            height={650}
            className="mx-auto h-auto w-[87%] max-w-[83%]"
          />
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-[60px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
          <blockquote className="mb-8 text-[18px] italic leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            I do not try to compete with big box companies. What we offer is specialized nutrition. We listen, and do not use computer generated responses to determine what your special dog needs. Because every dog is different.
          </blockquote>
          <p className="text-[15px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <strong>– Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist, Owner of Waggin Meals</strong>
          </p>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-[35px] font-normal text-[#3c3a47] md:text-[30px] sm:text-[24px]" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Our Promise to You & Your Pet
          </h2>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Promise 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h3 className="mb-3 text-center text-[18px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Quality Ingredients
              </h3>
              <p className="text-center text-[14px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Human-grade ingredients sourced from local farms and trusted partners. No fillers, by-products, or artificial preservatives.
              </p>
            </div>

            {/* Promise 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 640 512" aria-hidden="true">
                  <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/>
                </svg>
              </div>
              <h3 className="mb-3 text-center text-[18px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Expert Formulation
              </h3>
              <p className="text-center text-[14px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Every recipe created by Christie Willett, M.A., M.S., a certified Canine Integrative Animal Nutritionist.
              </p>
            </div>

            {/* Promise 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                </svg>
              </div>
              <h3 className="mb-3 text-center text-[18px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Made with Love
              </h3>
              <p className="text-center text-[14px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Small-batch preparation in our certified commercial kitchen. We care about your dog like they're our own.
              </p>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="bg-white border-2 border-[#a5b5eb] rounded-lg p-6 mt-8">
            <h4 className="mb-4 text-center text-[16px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Important Information
            </h4>
            <div className="space-y-3 text-[13px] leading-relaxed text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <p>
                <strong className="text-[#3c3a47]">Professional Formulation:</strong> Our meals are scientifically formulated by Christie A. Willett, M.A., M.S., a Canine Integrative Animal Nutritionist, using evidence-based nutritional science and high-quality, human-grade ingredients.
              </p>
              <p>
                <strong className="text-[#3c3a47]">Not Veterinary Medicine:</strong> The information provided on this website and our products are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Our products are not veterinarian-prescribed medications or treatments.
              </p>
              <p>
                <strong className="text-[#3c3a47]">Consult Your Veterinarian:</strong> Always consult with your licensed veterinarian before making any changes to your pet's diet, especially if your pet has existing health conditions, is pregnant, nursing, or on medication. Your veterinarian can provide personalized medical advice for your pet's specific needs.
              </p>
              <p>
                <strong className="text-[#3c3a47]">Individual Results May Vary:</strong> Every dog is unique. While we strive to provide the highest quality nutrition, results may vary based on your pet's individual needs, health status, activity level, and metabolism. Monitor your pet's response and adjust portions as needed.
              </p>
              <p>
                <strong className="text-[#3c3a47]">Food Safety:</strong> Our products are prepared in a certified commercial kitchen following food safety protocols. Store frozen until ready to use. Thaw in refrigerator and use within 3-4 days. Never leave fresh food at room temperature for more than 2 hours.
              </p>
              <p className="text-[12px] pt-2 border-t border-[#e0e0e0]">
                <strong className="text-[#3c3a47]">Nutritional Consultations:</strong> While we offer nutritional consultation services, these consultations are educational in nature and do not replace veterinary care. For medical concerns, always seek professional veterinary medical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-0">
        {/* Section Header */}
        <div className="bg-white px-4 py-10">
          <h2 className="text-center text-[35px] font-semibold text-[#333333] md:text-[30px] sm:text-[24px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Happy Customers & Waggin Tails
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="mx-auto max-w-[1080px] px-4 py-0">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                quote: "\"Our dog Maisy absolutely devours the fresh meals that Christie prepares. And it's satisfying to know the food is prepared by a pet nutritionist. Can't recommend her enough.\"",
                author: 'Matt Wolfe + Maisy'
              },
              {
                quote: "\"Our large pup loves their food and broth! Christie is so helpful, kind & very knowledgeable about canine nutrition! You can tell she genuinely cares about your dog's health and not just selling products. They also offer a private dog park that you can rent hourly! We recently rented the park for our pups birthday and had a blast.\"",
                author: 'Elizabeth Joslin'
              },
              {
                quote: '"My dogs love this food!! I love the convenience and nutritional value this company provides. I know both of my dogs are getting the best quality ingredients. Both my girls look forward to meal times as they love the taste of the food and jump for joy."',
                author: 'Amber Munoz'
              },
              {
                quote: '"Top notch, prepared fresh on-site healthiest possible dog meals and treats! Certified and experienced owners & staff who care about your pets and you!! The new location is fantastic!!"',
                author: 'Thom Slater'
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6">
                <div className="mb-4 text-[48px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
                <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47] sm:text-[14px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {testimonial.quote}
                </p>
                <p className="text-[14px] font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Channel Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-normal text-white mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Learn from Christie on YouTube
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Get expert tips, nutrition guides, and behind-the-scenes insights into creating the perfect diet for your dog.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Video Placeholder 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Fresh Food Basics
                </h3>
                <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Learn the fundamentals of transitioning your dog to a fresh food diet and what to expect.
                </p>
              </div>
            </div>

            {/* Video Placeholder 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Portion Control Tips
                </h3>
                <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Discover how to properly measure and portion your dog's meals for optimal health.
                </p>
              </div>
            </div>

            {/* Video Placeholder 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Supplement Guide
                </h3>
                <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Understanding when and how to supplement your dog's fresh food diet.
                </p>
              </div>
            </div>
          </div>

          {/* YouTube CTA */}
          <div className="text-center">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#a5b5eb] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Subscribe to Our YouTube Channel →
            </a>
            <p className="text-sm text-white mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              New videos every week!
            </p>
          </div>

          {/* Development Note */}
          <div className="mt-8 bg-white bg-opacity-20 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="h-6 w-6 text-white mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  YouTube Integration Ready
                </h4>
                <p className="text-sm text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Once Christie provides her YouTube channel URL and specific video IDs, you can replace the placeholder video cards with actual embedded YouTube videos. Update the Subscribe button href with the channel URL (format: <code className="bg-white bg-opacity-20 px-2 py-1 rounded">https://www.youtube.com/@channelname</code>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="bg-gradient-to-br from-[#f0ebff] to-[#e6d9ff] px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#5E3B76] p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-normal text-[#5E3B76] mb-6 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Our Promise
            </h2>
            <p className="text-base text-[#1f1a16] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an Animal Nutritionist to meet <strong>AAFCO standards</strong> for dog(s) of all ages.
            </p>
            <div className="bg-[#f9f6ff] rounded-xl p-6 border-l-4 border-[#bc2c2c]">
              <h3 className="text-lg font-semibold text-[#5E3B76] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Important Info
              </h3>
              <p className="text-sm text-[#1f1a16] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Please note: Our meals are specially formulated for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your vet for any health-related decisions about your dog.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
