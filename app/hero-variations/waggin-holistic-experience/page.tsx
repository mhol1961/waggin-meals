"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, MessageCircle, Sparkles, Star, CalendarDays, X, CheckCircle2 } from 'lucide-react';
import { ComplianceBanner } from '@/components/compliance-banner';

const heroBullets = [
  'Microbiome testing with palette visuals',
  'Chef-made bowls, toppers, and broths',
  'Concierge chat + rewards built in',
];

const featureCards = [
  {
    tag: 'Signature',
    title: 'Gut Glow Program',
    description: 'Six-week rebuild that marries microbiome data with seasonal, small-batch meals.',
    cta: 'Book Gut Glow',
    href: '/nutrition-services',
    accent: '#2f4b38',
  },
  {
    tag: 'New',
    title: 'Palette Builder Kit',
    description: 'Color tiles + hydration tonics so you can plate Christie-approved meals at home.',
    cta: 'Preview Palette Kit',
    href: '/resources',
    accent: '#bc2c2c',
  },
  {
    tag: 'Members',
    title: 'Waggin Rewards Pantry',
    description: 'Unlock seasonal toppers, sms access, and surprise drops for VIP pups.',
    cta: 'Join Rewards Club',
    href: '/monthly-wag-box',
    accent: '#a4341f',
  },
];

const stats = [
  { label: 'Dogs Thriving', value: '520+' },
  { label: 'Avg. Symptom Relief', value: '17 days' },
  { label: 'Chef Rotations', value: '24 / yr' },
];

export default function WagginHolisticExperiencePage() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-[#fdf9f3] min-h-screen">
      {/* Announcement */}
      <div className="bg-[#2f4b38] text-white text-center text-sm py-3 px-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Free insulated tote on every local delivery · Thursday Palette Workshops · Complimentary vet-ready lab summaries
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-[#eadfce] px-4 py-5">
        <div className="mx-auto max-w-6xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/images/logo-waggin-meals.png"
              alt="Waggin Meals"
              width={140}
              height={140}
              className="rounded-full border border-[#ded2bf] shadow-lg"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#a4341f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Waggin Meals
              </p>
              <p className="text-3xl text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Holistic Nutrition Studio
              </p>
            </div>
          </Link>
          <div className="flex flex-wrap gap-4 text-sm text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Link href="/nutrition-services" className="font-semibold hover:text-[#bc2c2c]">
              Services
            </Link>
            <Link href="/shop" className="font-semibold hover:text-[#bc2c2c]">
              Meals &amp; Toppers
            </Link>
            <Link href="/resources" className="font-semibold hover:text-[#bc2c2c]">
              Guides
            </Link>
            <Link href="/testimonials" className="font-semibold hover:text-[#bc2c2c]">
              Proof
            </Link>
            <Link href="/contact" className="font-semibold hover:text-[#bc2c2c]">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <ComplianceBanner />

      {/* Hero */}
      <section className="relative px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-36 -left-20 w-80 h-80 bg-[#bc2c2c]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#2f4b38]/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-[#a4341f] uppercase tracking-[0.4em] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Biome energy, Waggin soul
            </p>
            <h1 className="text-[56px] leading-tight text-[#1f1a16] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Gorgeous gut healing built
              <br />
              around your dog&apos;s story.
            </h1>
            <p className="text-lg text-[#4a443b] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Designed with the creamy neutrals and refined spacing you loved from AnimalBiome—only every plate, photo, and CTA is 100% Waggin
              Meals. Showcase this hero on the live homepage or mix its elements into the final build.
            </p>

            <div className="space-y-3 mb-8">
              {heroBullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3 text-[#2f4b38]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <CheckCircle2 className="w-5 h-5 text-[#bc2c2c]" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/nutrition-services"
                className="bg-[#2f4b38] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#1f3324] transition-colors"
              >
                Build My Plan
              </Link>
              <Link
                href="/events"
                className="border-2 border-[#2f4b38] text-[#2f4b38] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2f4b38] hover:text-white transition-colors"
              >
                Join Palette Workshop
              </Link>
            </div>

            <div className="flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-[#5c5549]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[32px] shadow-2xl border border-[#efe1cf] p-6">
              <div className="grid gap-4">
                <div className="rounded-2xl overflow-hidden border border-[#f3e6d5]">
                  <Image
                    src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                    alt="Beef and sweet potato bowl"
                    width={1200}
                    height={800}
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#f3e6d5]">
                  <Image
                    src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                    alt="Chicken superfood board"
                    width={1200}
                    height={800}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#8a5a26]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Featured menu
                  </p>
                  <p className="text-2xl font-semibold text-[#1f1a16]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Better Belly Bundle
                  </p>
                  <p className="text-sm text-[#5c5549]">Fresh meals + tonics + palette download</p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#90211b]"
                >
                  Shop Bundle
                </Link>
              </div>
            </div>

            {/* Pop-in testimonial */}
            <div className="absolute -left-6 -bottom-8 bg-white border border-[#eadfce] rounded-2xl shadow-xl p-4 w-64">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/woman-with-white-dog.webp"
                  alt="Happy customer"
                  width={54}
                  height={54}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#2f4b38]">Leah + Augie</p>
                  <div className="flex text-[#f6a723]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#4a443b]">
                “Palette visuals made it easy to brief our vet. The concierge chat kept us on track every step.”
              </p>
            </div>
          </div>
        </div>

        {/* Floating rewards + chat widget */}
        <div className="absolute bottom-6 left-6">
          <button className="flex items-center gap-2 bg-[#1b2d21] text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold">
            <Gift className="w-4 h-4" />
            Waggin Rewards
          </button>
        </div>

        <div className="absolute bottom-6 right-6 w-72 bg-white border border-[#eadfce] rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-[#f0e5d6]">
            <button className="flex-1 text-sm font-semibold py-3 border-b-2 border-[#2f4b38] text-[#2f4b38]">Answers</button>
            <button className="flex-1 text-sm font-semibold py-3 text-[#a0a0a0] hover:text-[#2f4b38]">Chat</button>
          </div>
          <div className="p-4 space-y-3 text-sm text-[#4a443b]">
            <div className="flex gap-3">
              <CalendarDays className="w-5 h-5 text-[#2f4b38]" />
              <div>
                <p className="font-semibold">Need a consult?</p>
                <p className="text-xs text-[#756b5d]">Tap to book or send quick questions anytime.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-[#bc2c2c]" />
              <div>
                <p className="font-semibold">Palette Explainer</p>
                <p className="text-xs text-[#756b5d]">How the color system works for your dog.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center w-full bg-[#f0f7ff] text-[#2f4b38] py-2 rounded-2xl font-semibold">
              Open Support Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[#bc2c2c] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Next-step ideas
              </p>
              <h2 className="text-[36px] text-[#1f1a16]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Preview how this hero feeds the rest of the page.
              </h2>
            </div>
            <Link href="/hero-variations" className="text-sm font-semibold text-[#2f4b38] hover:underline">
              Browse experiments →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featureCards.map((card) => (
              <div key={card.title} className="rounded-3xl border border-[#efe1cf] bg-[#fefbf7] shadow-sm p-6 hover:shadow-lg transition-shadow">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
                  style={{ backgroundColor: card.accent }}
                >
                  {card.tag}
                </span>
                <h3 className="text-2xl text-[#1f1a16] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm text-[#4a443b] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {card.description}
                </p>
                <Link href={card.href} className="text-sm font-semibold text-[#2f4b38] hover:text-[#bc2c2c]">
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-xl w-full p-8 relative border border-[#f1e5d3]">
            <button
              aria-label="Close modal"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#5c5549] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <Image
                src="/images/waggin-logos.png"
                alt="Waggin icon"
                width={140}
                height={140}
                className="rounded-full border border-[#eadfce] shadow-inner bg-[#fdf9f3]"
              />
              <div>
                <p className="text-sm font-semibold text-[#bc2c2c] uppercase tracking-[0.4em]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Save $25
                </p>
                <h3 className="text-3xl text-[#1f1a16] mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Grab our kitchen intel + discounts.
                </h3>
                <p className="text-sm text-[#4a443b] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Sunday prep tips, palette inspiration, and VIP-only offers delivered weekly.
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 rounded-full border border-[#eadfce] px-4 py-3 text-sm focus:outline-none focus:border-[#bc2c2c]"
                  />
                  <button className="bg-[#2f4b38] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1d3425]">
                    Send me goodies
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
