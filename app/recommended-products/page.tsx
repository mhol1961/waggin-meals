'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Mock affiliate products - replace with actual products
const affiliateProducts = [
  {
    id: 1,
    name: "Stainless Steel Elevated Dog Bowls",
    category: "Feeding Supplies",
    brand: "PetFusion",
    price: "$42.95",
    image: "/images/chicken-superfood-board.jpg", // Replace with actual product image
    affiliateLink: "#", // Replace with actual affiliate link
    description: "Veterinarian-recommended elevated bowls reduce strain on neck and joints. Dishwasher-safe stainless steel.",
    christiesSay: "Perfect height for medium to large dogs. The elevation aids digestion and the stainless steel is easy to keep clean—essential for fresh food feeding!",
    features: [
      "Reduces neck strain during feeding",
      "Dishwasher-safe stainless steel",
      "Non-slip base for stability",
      "Holds 6 cups per bowl"
    ]
  },
  {
    id: 2,
    name: "Digital Kitchen Scale (5kg)",
    category: "Feeding Supplies",
    brand: "Ozeri",
    price: "$14.99",
    image: "/images/beef-sweet-potato-bowl.jpg",
    affiliateLink: "#",
    description: "Precise measurements for accurate portion control. Essential for homemade dog food preparation.",
    christiesSay: "Accurate portioning is CRUCIAL for fresh food feeding. I use this exact scale in my own kitchen and recommend it to every client. The tare function makes measuring multiple ingredients a breeze!",
    features: [
      "Accurate to 1 gram",
      "Tare function for containers",
      "Easy-to-read LCD display",
      "Compact and lightweight"
    ]
  },
  {
    id: 3,
    name: "The Forever Dog Book",
    category: "Books & Education",
    brand: "Dr. Karen Becker",
    price: "$18.99",
    image: "/images/woman-with-white-dog.webp",
    affiliateLink: "#",
    description: "Groundbreaking guide to extending your dog's healthy years through nutrition and lifestyle.",
    christiesSay: "This book transformed how I think about canine nutrition! Dr. Becker's research on longevity and fresh food is required reading for any dog parent serious about their pet's health.",
    features: [
      "Science-based longevity strategies",
      "Fresh food nutrition protocols",
      "Written by leading holistic vet",
      "Practical implementation guide"
    ]
  },
  {
    id: 4,
    name: "Glass Meal Prep Containers (10-pack)",
    category: "Feeding Supplies",
    brand: "Prep Naturals",
    price: "$29.99",
    image: "/images/chicken-superfood-board.jpg",
    affiliateLink: "#",
    description: "BPA-free glass containers perfect for batch preparing and storing fresh dog food meals.",
    christiesSay: "Meal prep Sunday just got easier! These glass containers stack beautifully in the fridge and are completely safe for storing fresh food. I prep a week's worth of meals at once.",
    features: [
      "100% BPA-free glass",
      "Airtight locking lids",
      "Microwave and dishwasher safe",
      "Stackable design saves space"
    ]
  },
  {
    id: 5,
    name: "Nordic Naturals Omega-3 Pet",
    category: "Supplements",
    brand: "Nordic Naturals",
    price: "$26.95",
    image: "/images/beef-sweet-potato-bowl.jpg",
    affiliateLink: "#",
    description: "High-quality fish oil for dogs. Supports skin, coat, joint, and heart health.",
    christiesSay: "Not all fish oils are created equal! Nordic Naturals uses third-party testing for purity and freshness. This is the brand I trust for my own dogs and recommend to clients needing omega-3 supplementation.",
    features: [
      "Third-party tested for purity",
      "No fishy aftertaste",
      "Supports coat and joint health",
      "Easy-to-use pump bottle"
    ]
  },
  {
    id: 6,
    name: "Slow Feeder Bowl",
    category: "Feeding Supplies",
    brand: "Outward Hound",
    price: "$12.99",
    image: "/images/woman-with-white-dog.webp",
    affiliateLink: "#",
    description: "Maze design slows eating pace, reducing bloat and improving digestion.",
    christiesSay: "For dogs who inhale their food! This bowl slows down fast eaters and turns mealtime into mental enrichment. Especially helpful for fresh food feeders whose dogs get overly excited.",
    features: [
      "Slows eating by up to 10x",
      "Reduces bloat risk",
      "Non-slip base",
      "Dishwasher safe"
    ]
  },
  {
    id: 7,
    name: "Canine Nutrigenomics Book",
    category: "Books & Education",
    brand: "Dr. Jean Dodds",
    price: "$24.95",
    image: "/images/chicken-superfood-board.jpg",
    affiliateLink: "#",
    description: "The science behind how food influences your dog's genes and health outcomes.",
    christiesSay: "Dr. Dodds is a pioneer in canine nutrition science. This book dives deep into the 'why' behind fresh food nutrition and epigenetics. Perfect for the science-minded dog parent!",
    features: [
      "Evidence-based nutrition science",
      "Genetic factors in nutrition",
      "Practical feeding protocols",
      "Written by renowned researcher"
    ]
  },
  {
    id: 8,
    name: "Stainless Steel Measuring Cups",
    category: "Feeding Supplies",
    brand: "Hudson Essentials",
    price: "$16.99",
    image: "/images/beef-sweet-potato-bowl.jpg",
    affiliateLink: "#",
    description: "Professional-grade measuring cups for precise meal portioning.",
    christiesSay: "Durable, accurate, and easy to clean. These are commercial kitchen quality—they'll last forever and ensure your portions are always exact.",
    features: [
      "Dishwasher safe stainless steel",
      "Etched measurement markings",
      "Nested for storage",
      "Includes 1/4 to 1 cup sizes"
    ]
  },
  {
    id: 9,
    name: "Freeze-Dried Treat Pouches",
    category: "Treats",
    brand: "Vital Essentials",
    price: "$19.99",
    image: "/images/woman-with-white-dog.webp",
    affiliateLink: "#",
    description: "Single-ingredient freeze-dried treats. Perfect training rewards.",
    christiesSay: "These are pure, single-ingredient treats with no additives. Great for training or as high-value rewards. I love that they're freeze-dried—all the nutrition, none of the junk!",
    features: [
      "Single ingredient (100% meat)",
      "No preservatives or additives",
      "High in protein",
      "Made in USA"
    ]
  },
];

const categories = [
  "All Products",
  "Feeding Supplies",
  "Books & Education",
  "Supplements",
  "Treats",
];

export default function RecommendedProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const filteredProducts = selectedCategory === "All Products"
    ? affiliateProducts
    : affiliateProducts.filter(p => p.category === selectedCategory);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Christie's Recommended Products
          </h1>
          <p className="text-lg text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Carefully curated tools, supplements, and resources to support your fresh food journey
          </p>
          <p className="text-sm text-white opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Products I personally use and recommend to my clients
          </p>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <section className="bg-[#fff3cd] border-b-2 border-[#ffc107] px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[#856404] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="font-semibold text-[#856404] text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Affiliate Disclosure
              </h3>
              <p className="text-xs text-[#856404]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Some links on this page are affiliate links. This means I may earn a small commission if you make a purchase through these links, at no additional cost to you. I only recommend products I personally use and genuinely believe will benefit you and your dog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 px-4 py-6 sticky top-20 z-40">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#a5b5eb] text-white"
                    : "bg-gray-100 text-[#666666] hover:bg-gray-200"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-[16px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== "All Products" && ` in ${selectedCategory}`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#a5b5eb] text-white px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-xs text-[#999999] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.brand}
                    </p>
                    <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#666666] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {product.description}
                    </p>
                  </div>

                  {/* Christie's Recommendation */}
                  <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#a5b5eb] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        C
                      </div>
                      <p className="text-xs font-semibold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Christie's Take:
                      </p>
                    </div>
                    <p className="text-xs text-[#666666] italic leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      "{product.christiesSay}"
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-4 flex-1">
                    <ul className="space-y-1">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[#a5b5eb] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                    <div>
                      <p className="text-xs text-[#999999] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Price
                      </p>
                      <p className="text-2xl font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {product.price}
                      </p>
                    </div>
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#a5b5eb] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#8a9fd9] transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      View Product →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why I Recommend Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Why I Only Recommend What I Use
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Personally Tested
              </h3>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                I use every product I recommend with my own dogs or in my professional practice
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Science-Backed
              </h3>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Each recommendation is supported by nutritional science and my professional training
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">💙</div>
              <h3 className="font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Client-Approved
              </h3>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                My clients consistently report success with these tools and products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Help Choosing the Right Products?
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            During your consultation, I'll recommend specific products tailored to your dog's individual needs and your lifestyle.
          </p>
          <Link
            href="/nutrition-services"
            className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Your Consultation - $395
          </Link>
        </div>
      </section>

      {/* Development Note */}
      <section className="bg-[#d1ecf1] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start">
            <svg className="h-8 w-8 text-[#0c5460] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-[#0c5460] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Replace Mock Data with Real Products
              </h3>
              <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Update the <code className="bg-[#0c5460] bg-opacity-10 px-2 py-1 rounded">affiliateProducts</code> array with:
              </p>
              <ul className="list-disc list-inside mt-2 text-[13px] text-[#0c5460] space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>Actual product names, brands, and prices</li>
                <li>Real affiliate links (Amazon Associates, etc.)</li>
                <li>Product images (upload to <code className="bg-[#0c5460] bg-opacity-10 px-1 rounded">/public/images/products/</code>)</li>
                <li>Christie's actual recommendations and reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
