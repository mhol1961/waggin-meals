'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossed, Award, Heart, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TwistedLaurelPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2f4b38] via-[#3d5f4a] to-[#2f4b38] text-white px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <UtensilsCrossed className="w-5 h-5 text-[#f6a723]" />
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Restaurant Partnership
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-normal mb-6"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            As Served At Twisted Laurel
          </h1>

          <p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            A Culinary Partnership in Asheville, NC
          </p>

          <p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Where exceptional cuisine meets exceptional pet nutrition
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-16 md:py-20 bg-[#f5f1ea]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Award className="w-16 h-16 text-[#bc2c2c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl font-normal text-[#2f4b38] mb-6"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              The Partnership
            </h2>
            <p
              className="text-lg text-[#4a443b] leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              We're honored to announce that Waggin' Meals is now featured at Twisted Laurel Restaurant in Asheville, North Carolina. This prestigious partnership brings together our commitment to premium, human-grade pet nutrition with one of Asheville's most beloved dining establishments.
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#ded2bf] p-8 md:p-10 shadow-lg">
            <div className="prose prose-lg max-w-none">
              <p
                className="text-base text-[#1f1a16] leading-relaxed mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <strong className="text-[#2f4b38]">What makes this special?</strong><br />
                Twisted Laurel Restaurant has built its reputation on sourcing the finest ingredients and preparing them with care and expertise. When they chose to feature Waggin' Meals on their menu, it was a validation of our commitment to the same principles — real, wholesome ingredients prepared with love and scientific precision.
              </p>

              <p
                className="text-base text-[#1f1a16] leading-relaxed mb-6"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Just as Twisted Laurel serves exceptional meals to their human guests, they now offer Waggin' Meals to their four-legged visitors. Our gently cooked, human-grade dog food meets the same exacting standards as the restaurant's own cuisine.
              </p>

              <div className="bg-[#f5f1ea] border-l-4 border-[#bc2c2c] p-6 rounded-r-lg my-8">
                <p
                  className="text-base text-[#2f4b38] font-semibold italic mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  "We believe every diner deserves exceptional food — whether they have two legs or four."
                </p>
                <p
                  className="text-sm text-[#4a443b]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  — Twisted Laurel Restaurant
                </p>
              </div>

              <p
                className="text-base text-[#1f1a16] leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                This partnership represents our shared values: quality ingredients, expert preparation, and a dedication to serving the best to those we care about. We're proud to be part of the Twisted Laurel family and to bring premium nutrition to their discerning guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-[#bc2c2c] mx-auto mb-4" />
            <h2
              className="text-4xl md:text-5xl font-normal text-[#2f4b38] mb-4"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              See The Partnership
            </h2>
            <p
              className="text-lg text-[#4a443b]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Photos from Twisted Laurel Restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="relative overflow-hidden rounded-2xl border-2 border-[#ded2bf] shadow-lg hover:shadow-2xl transition-shadow duration-300 aspect-[4/3] bg-[#f5f1ea]"
              >
                <Image
                  src={`/images/twisted-laurel-${num}.jpeg`}
                  alt={`Waggin' Meals at Twisted Laurel Restaurant - Image ${num}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Twisted Laurel */}
      <section className="px-4 py-16 md:py-20 bg-[#f5f1ea]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#2f4b38] p-8 md:p-10 shadow-lg">
            <div className="text-center mb-8">
              <UtensilsCrossed className="w-16 h-16 text-[#2f4b38] mx-auto mb-4" />
              <h2
                className="text-3xl md:text-4xl font-normal text-[#2f4b38] mb-4"
                style={{ fontFamily: "'Abril Fatface', serif" }}
              >
                About Twisted Laurel Restaurant
              </h2>
            </div>

            <div className="space-y-6">
              <p
                className="text-base text-[#1f1a16] leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <strong className="text-[#2f4b38]">Location:</strong> Asheville, North Carolina<br />
                A beloved destination in the heart of Asheville's vibrant culinary scene
              </p>

              <p
                className="text-base text-[#1f1a16] leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <strong className="text-[#2f4b38]">Philosophy:</strong> Twisted Laurel is committed to exceptional ingredients, expert preparation, and memorable dining experiences. Their dedication to quality extends to every aspect of their service — including what they offer to their guests' four-legged companions.
              </p>

              <div className="flex justify-center pt-6">
                <a
                  href="https://www.facebook.com/share/1BNFyA7bMm/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#2f4b38] text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-[#243a2c] transition-colors shadow-md"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Visit Twisted Laurel on Facebook
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-20 bg-gradient-to-br from-[#2f4b38] via-[#3d5f4a] to-[#2f4b38] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-normal mb-6"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Try What Twisted Laurel Serves
          </h2>

          <p
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Experience the same premium, human-grade dog food that Twisted Laurel Restaurant trusts for their guests' beloved pets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-[#bc2c2c] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#90211b] transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Fresh Meals
            </Link>

            <Link
              href="/nutrition-services"
              className="inline-block bg-white text-[#2f4b38] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Get Nutrition Consultation
            </Link>
          </div>

          <p
            className="text-sm text-white/70 mt-8"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            FDA-approved · AAFCO-compliant · Formulated by a Board-Certified Nutritionist
          </p>
        </div>
      </section>
    </main>
  );
}
