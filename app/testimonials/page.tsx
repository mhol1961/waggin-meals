'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Sample testimonials - replace with actual client data
const testimonials = [
  {
    id: 1,
    dogName: "Bella",
    ownerName: "Sarah M.",
    location: "Austin, TX",
    category: "Weight Loss",
    problem: "Overweight & Low Energy",
    result: "Lost 12 lbs in 4 months, energy levels soared",
    quote: "I was skeptical about fresh food, but Christie's custom meal plan completely transformed Bella's life. She lost weight gradually and safely, and now she plays like a puppy again! The best investment I've ever made in her health.",
    service: "3-Month Custom Meal Plan",
    rating: 5,
    image: "/images/woman-with-white-dog.webp", // Replace with actual client photos
  },
  {
    id: 2,
    dogName: "Max",
    ownerName: "Jennifer L.",
    location: "Denver, CO",
    category: "Digestive Issues",
    problem: "Chronic Diarrhea & Food Sensitivities",
    result: "No digestive issues in 6 months",
    quote: "Max had constant digestive problems for 2 years. We tried every expensive kibble brand. Christie identified his food sensitivities through testing and created a plan that actually works. He hasn't had diarrhea in over 6 months!",
    service: "Food Sensitivity Testing + Custom Plan",
    rating: 5,
    image: "/images/chicken-superfood-board.jpg",
  },
  {
    id: 3,
    dogName: "Luna",
    ownerName: "Michael R.",
    location: "Seattle, WA",
    category: "Picky Eaters",
    problem: "Refused to eat kibble, very underweight",
    result: "Now eats every meal enthusiastically",
    quote: "Luna was dangerously underweight because she would barely touch her food. Christie's fresh food recipes completely changed her relationship with mealtime. She now runs to her bowl and finishes every bite!",
    service: "Custom Meal Plan + Transition Support",
    rating: 5,
    image: "/images/beef-sweet-potato-bowl.jpg",
  },
  {
    id: 4,
    dogName: "Charlie",
    ownerName: "Amanda K.",
    location: "Boston, MA",
    category: "Puppies",
    problem: "First-time puppy parent, overwhelmed",
    result: "Confident in feeding, puppy thriving",
    quote: "As a first-time dog owner, I had no idea how to feed my puppy properly. Christie walked me through everything—portions, nutrients, feeding schedules. Charlie is growing perfectly and his vet is impressed with his condition!",
    service: "Puppy Nutrition Consultation",
    rating: 5,
    image: "/images/woman-with-white-dog.webp",
  },
  {
    id: 5,
    dogName: "Rocky",
    ownerName: "David T.",
    location: "Phoenix, AZ",
    category: "Health Issues",
    problem: "Kidney disease diagnosis",
    result: "Kidney values stabilized, quality of life improved",
    quote: "When Rocky was diagnosed with kidney disease, I was devastated. Christie created a kidney-supportive meal plan that my vet approved. His bloodwork has stabilized and he feels so much better. She gave us hope.",
    service: "Medical Nutrition Consultation",
    rating: 5,
    image: "/images/chicken-superfood-board.jpg",
  },
  {
    id: 6,
    dogName: "Daisy",
    ownerName: "Lisa P.",
    location: "Miami, FL",
    category: "Skin & Coat",
    problem: "Constant itching, dull coat",
    result: "Shiny coat, no more scratching",
    quote: "Daisy scratched herself raw constantly. The vet said it was food allergies. Christie's elimination diet identified the triggers and her new meal plan has her coat looking shiny and healthy. No more scratching!",
    service: "Food Sensitivity Testing + Custom Plan",
    rating: 5,
    image: "/images/beef-sweet-potato-bowl.jpg",
  },
];

const categories = [
  "All Success Stories",
  "Weight Loss",
  "Digestive Issues",
  "Picky Eaters",
  "Puppies",
  "Health Issues",
  "Skin & Coat",
];

export default function TestimonialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Success Stories");

  const filteredTestimonials = selectedCategory === "All Success Stories"
    ? testimonials
    : testimonials.filter(t => t.category === selectedCategory);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Real Results from Real Dogs
          </h1>
          <p className="text-lg text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            See how custom nutrition plans have transformed the lives of dogs just like yours
          </p>
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-6 py-3 rounded-full">
            <span className="text-3xl font-bold text-white">300+</span>
            <span className="text-sm text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Happy, Healthy Dogs</span>
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

      {/* Testimonials Grid */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-[16px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Showing {filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'story' : 'stories'}
              {selectedCategory !== "All Success Stories" && ` in ${selectedCategory}`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-64">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.dogName} and ${testimonial.ownerName}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#a5b5eb] text-white px-4 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {testimonial.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Dog & Owner Info */}
                  <h3 className="text-2xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {testimonial.dogName} & {testimonial.ownerName}
                  </h3>
                  <p className="text-sm text-[#999999] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    📍 {testimonial.location}
                  </p>

                  {/* Problem → Solution */}
                  <div className="mb-4 p-4 bg-[#f8f9fa] rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-[#dc3545] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Problem:
                        </p>
                        <p className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {testimonial.problem}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-[#28a745] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Result:
                        </p>
                        <p className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {testimonial.result}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="mb-4">
                    <p className="text-[15px] text-[#3c3a47] leading-relaxed italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      "{testimonial.quote}"
                    </p>
                  </blockquote>

                  {/* Service Used */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-[#999999] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Service Used:
                    </p>
                    <p className="text-sm font-semibold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {testimonial.service}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            The Waggin Meals Difference
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                98%
              </div>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Client Satisfaction Rate
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                300+
              </div>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Dogs Transformed
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                15+
              </div>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Years of Experience
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#a5b5eb] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                100%
              </div>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Your Dog Could Be Next
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Every success story started with one consultation. Let's create a custom nutrition plan
            that transforms your dog's health, energy, and quality of life.
          </p>
          <Link
            href="/nutrition-services"
            className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Your Consultation - $395
          </Link>
          <p className="text-sm text-[#666666] mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            100% satisfaction guaranteed or your money back
          </p>
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
                Add Real Client Testimonials
              </h3>
              <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Replace the sample testimonials with actual client photos and stories. Upload photos to <code className="bg-[#0c5460] bg-opacity-10 px-2 py-1 rounded">/public/images/testimonials/</code> and update the data in this file.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
