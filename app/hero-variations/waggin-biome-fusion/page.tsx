"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, MessageCircle, CheckCircle2, X } from 'lucide-react';
import { ComplianceBanner } from '@/components/compliance-banner';

const heroHighlights = [
  'Microbiome swab + palette analysis',
  'Small-batch meals + toppers',
  'VIP rewards and concierge chat',
];

const featureCards = [
  {
    tag: 'Best Seller',
    title: 'Gut Reset Ritual',
    body: 'Six-week culinary sprint with FMT capsules, texture rotation, and vet portal sharing.',
    href: '/nutrition-services',
    cta: 'Book Gut Reset',
    accent: '#2f4b38',
  },
  {
    tag: 'New',
    title: 'Palette Builder Kit',
    body: 'Color-coded ingredient tiles + hydration tonics so pet parents can plate with confidence.',
    href: '/resources',
    cta: 'Download Sample Palette',
    accent: '#bc2c2c',
  },
  {
    tag: 'Members',
    title: 'Better Rewards Club',
    body: 'Earn points on every consult, unlock seasonal toppers, and text Christie for realtime tweaks.',
    href: '/monthly-wag-box',
    cta: 'Join Rewards',
    accent: '#a4341f',
  },
];

export default function WagginBiomeFusionPage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-[#f5f1ea] min-h-screen">
      {/* Announcement */}
      <div className="bg-[#2f4b38] text-white text-center text-sm py-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Local deliveries include our insulated tote · Palette workshops every Thursday · Free shipping over $165
      </div>

      {/* Navigation */}
      <nav className="bg-white px-4 py-5 border-b border-[#e5ddce] shadow-sm">
        <div className="mx-auto max-w-6xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/images/logo-waggin-meals.png"
              alt="Waggin Meals"
              width={120}
              height={120}
              className="rounded-full shadow-md border border-[#dad2c4]"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#bc2c2c]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Waggin Meals
              </p>
              <p className="text-3xl text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Nutrition Studio
              </p>
            </div>
          </Link>

          <div className="flex flex-wrap gap-4 text-sm text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Link href="/hero-variations" className="hover:text-[#bc2c2c] font-semibold">
              Hero Variations
            </Link>
            <Link href="/nutrition-services" className="hover:text-[#bc2c2c] font-semibold">
              Nutrition Services
            </Link>
            <Link href="/shop" className="hover:text-[#bc2c2c] font-semibold">
              Fresh Meals
            </Link>
            <Link href="/resources" className="hover:text-[#bc2c2c] font-semibold">
              Resources
            </Link>
            <Link href="/contact" className="hover:text-[#bc2c2c] font-semibold">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <ComplianceBanner />

      {/* Hero */}
      <section className="relative px-4 py-16 overflow-hidden bg-[#fdfbf7]">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#bc2c2c]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#2f4b38]/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="text-sm font-semibold text-[#a4341f] uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Inspired by AnimalBiome · Crafted for Waggin Meals
            </p>
            <h1 className="text-[54px] leading-tight text-[#241f1f] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Transform Their Gut Story
              <br />
              Into Plates They Crave
            </h1>
            <p className="text-lg text-[#4e4a42] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We pair microbiome labs with chef-built bowls so you never guess what should be in the wagon. The layout borrows the mellow cream +
              evergreen calm you loved from AnimalBiome while keeping Waggin’s playful warmth.
            </p>

            <div className="grid gap-3 mb-8">
              {heroHighlights.map((item) => (
                <div key={item} className="flex items-center gap-3 text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <CheckCircle2 className="w-5 h-5 text-[#bc2c2c]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/nutrition-services"
                className="bg-[#2f4b38] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#203626] transition-colors"
              >
                Start Custom Plan
              </Link>
              <Link
                href="/testimonials"
                className="border-2 border-[#2f4b38] text-[#2f4b38] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2f4b38] hover:text-white transition-colors"
              >
                See Success Stories
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[30px] shadow-2xl border border-[#eee4d3] p-6">
              <div className="rounded-2xl overflow-hidden border border-[#f1e3cc] mb-6">
                <Image
                  src="/images/biome-example-hero-shop-page-rewards-and-chat.png"
                  alt="AnimalBiome inspiration"
                  width={1000}
                  height={680}
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#8a5a26]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Palette Kit
                  </p>
                  <p className="text-2xl font-semibold text-[#2f4b38]">Better Belly Bundle</p>
                  <p className="text-sm text-[#5d5a52]">$129 · includes lab decoding + three topper jars</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#97231c]"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="absolute -left-6 -bottom-8 bg-white border border-[#e9ddc7] rounded-2xl shadow-xl p-4 w-64">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                  alt="Fresh bowl"
                  width={56}
                  height={56}
                  className="rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#2f4b38]">Rewards unlocked</p>
                  <p className="text-xs text-[#5d5a52]">+250 pts · Waggin Club</p>
                </div>
              </div>
              <p className="text-xs text-[#463f35]">
                “We loved the mellow greens with Waggin’s wagon red pop—this design feels premium but still us.”
              </p>
            </div>
          </div>
        </div>

        {/* Floating buttons */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#0f2818] text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold">
            <Gift className="w-4 h-4" />
            Join Rewards
          </button>
        </div>
        <button className="absolute bottom-6 right-6 bg-white border border-[#d8cdbb] text-[#2f4b38] p-3 rounded-full shadow-xl">
          <MessageCircle className="w-6 h-6" />
        </button>
      </section>

      {/* Feature cards */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[#bc2c2c] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Concierge Services
              </p>
              <h2 className="text-[38px] text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Mix-and-match these flows for the final homepage hero.
              </h2>
            </div>
            <Link href="/contact" className="text-sm font-semibold text-[#2f4b38] hover:underline" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Share feedback →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featureCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-[#eee2d1] p-6 shadow-sm hover:shadow-lg transition-shadow bg-[#fdfaf4]">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
                  style={{ backgroundColor: card.accent }}
                >
                  {card.tag}
                </span>
                <h3 className="text-2xl text-[#1f1a16] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm text-[#4c483f] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {card.body}
                </p>
                <Link href={card.href} className="text-sm font-semibold text-[#2f4b38] hover:text-[#bc2c2c]">
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-xl w-full p-8 relative border border-[#f1e7d6]">
            <button
              aria-label="Close modal"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#5d5a52] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Image
                src="/images/waggin-logos.png"
                alt="Waggin Meals badge"
                width={140}
                height={140}
                className="rounded-full border border-[#e7dcca] shadow-inner bg-[#fefbf7]"
              />
              <div>
                <p className="text-sm font-semibold text-[#bc2c2c] uppercase tracking-[0.4em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Newsletter
                </p>
                <h3 className="text-3xl text-[#1f1a16] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Steal Christie’s Sunday Prep Notes
                </h3>
                <p className="text-sm text-[#4c483f] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Bite-sized microbiome tips, palette inspo, and early access to seasonal bowls. Drops Fridays at 9 a.m. CST.
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 rounded-full border border-[#e8dcc8] px-4 py-3 text-sm focus:outline-none focus:border-[#bc2c2c]"
                  />
                  <button className="bg-[#2f4b38] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#203626]">
                    Get Notes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
