"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Palette, Droplets, Leaf, ShieldCheck, Activity, Microscope, Sparkles, Stethoscope, Mail, Phone, ChevronDown, Menu } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Pet Nutrition Services',
    dropdown: [
      { label: 'Nutrition Consultation ($395)', href: '/nutrition-services' },
      { label: 'Food Sensitivity Testing', href: '/food-sensitivities' },
      { label: 'Supplementation Guide', href: '/supplementation' },
    ]
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Fresh Food Feeding Guide', href: '/guides/fresh-food-guide' },
      { label: 'Feeding Calculator', href: '#calculator' },
      { label: 'Free PDF Guides', href: '/resources' },
      { label: 'Feeding Made Simple', href: '/feeding-made-simple' },
      { label: 'Recommended Products', href: '/recommended-products' },
      { label: 'Pet Nutrition Insights', href: '/blog' },
      { label: 'Events Calendar', href: '/events' },
    ]
  },
  {
    label: 'Nutrition Topics',
    dropdown: [
      { label: 'Puppies', href: '/puppies' },
      { label: 'Weight Management', href: '/weight-management' },
      { label: 'Kidney Health', href: '/kidney-health' },
      { label: 'Digestive Health', href: '/digestive-health' },
    ]
  },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Success Stories',
    dropdown: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Testimonials', href: '/testimonials' },
    ]
  },
];

const paletteBands = [
  {
    label: 'Sunrise Amber',
    color: '#f6ad55',
    focus: 'Hormone harmony + anti-inflammatory',
    description: 'Butternut squash, pumpkin, and pastured eggs deliver beta carotene and healthy fats that soothe joints and skin.',
  },
  {
    label: 'Forest Canopy',
    color: '#34d399',
    focus: 'Detox + fiber diversity',
    description: 'Broccoli microgreens, dandelion greens, kelp, and parsley scrub toxins while feeding good bacteria.',
  },
  {
    label: 'Glacier Mineral',
    color: '#5eead4',
    focus: 'Hydration + electrolyte balance',
    description: 'Bone broth, cucumber, celery, and coconut water jelly keep picky drinkers hydrated without upsetting tummies.',
  },
  {
    label: 'Soil Rich Violet',
    color: '#c084fc',
    focus: 'Antioxidant & immune repair',
    description: 'Blueberries, red cabbage, and fermented purple sweet potatoes calm oxidative stress at the cellular level.',
  },
];

const kitSteps = [
  {
    title: 'Swab + Send',
    description: '48-hour turnaround microbiome test with shipping both ways included in every VIP plan.',
  },
  {
    title: 'Decode the Palette',
    description: 'We translate lab results into color bands so you instantly see what your dog is missing.',
  },
  {
    title: 'Plate the Colors',
    description: 'Receive chef-tested recipes, topper ideas, and sourcing options for each shade.',
  },
];

const microActions = [
  { icon: Droplets, title: 'Hydration Drips', detail: 'Tonics + broth cubes color-matched to gut needs.' },
  { icon: Leaf, title: 'Phytonutrient Cycling', detail: 'Weekly rotations so no micronutrient is left behind.' },
  { icon: ShieldCheck, title: 'Barrier Support', detail: 'Targeted zinc, colostrum, and omegas to seal the gut wall.' },
];

const stats = [
  { label: 'Custom palettes delivered', value: '120+' },
  { label: 'Average symptom relief', value: '17 days' },
  { label: 'Fresh components tracked', value: '42' },
];

const badges = ['AAFCO-balanced', 'Human-grade kitchen', 'Lab verified', 'Local sourcing network'];

export default function BiomeColorPalettePage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="bg-white">
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#ded2bf] px-4 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-waggin-meals.png"
                alt="Waggin Meals"
                width={72}
                height={72}
                className="rounded-full border border-[#ded2bf] shadow-md"
              />
              <div>
                <p className="text-[8.4px] uppercase tracking-[0.25em] text-[#a4341f]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Waggin Meals
                </p>
                <p className="text-[14.4px] leading-tight text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Holistic Nutrition Studio
                </p>
                <p className="text-[7.2px] text-[#5c5549] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Founded by Christie Webb, Certified Canine Nutritionist
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {'dropdown' in item ? (
                    <>
                      <button
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#2f4b38] px-3 py-2 hover:text-[#bc2c2c] transition-colors"
                        suppressHydrationWarning
                      >
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#ded2bf] py-2 z-50">
                          {item.dropdown?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#2f4b38] hover:bg-[#f5f1ea] transition-colors"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-xs font-semibold uppercase tracking-wide text-[#2f4b38] px-3 py-2 hover:text-[#bc2c2c] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="bg-[#bc2c2c] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#90211b] transition-colors ml-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2f4b38] hover:bg-[#f5f1ea] rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t border-[#ded2bf] pt-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {'dropdown' in item ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-[#2f4b38] px-3 py-2 hover:bg-[#f5f1ea] rounded-md"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        suppressHydrationWarning
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && item.dropdown && (
                        <div className="pl-3 space-y-1 mt-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-[#5c5549] hover:bg-[#f5f1ea] rounded-md"
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-sm font-semibold text-[#2f4b38] px-3 py-2 hover:bg-[#f5f1ea] rounded-md"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="block text-center bg-[#bc2c2c] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#90211b] transition-colors mt-3 mx-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-[#fff9f2] via-white to-[#f0fdfa] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-80 h-80 bg-[#f8d4b8] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#b2f5ea] rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-white/70 border border-[#f6ad55]/40 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Palette className="w-5 h-5 text-[#f6ad55] mr-2" />
              <span className="text-sm font-semibold text-[#c05621]">Biome Color Palette™ Method</span>
            </div>

            <h1
              className="text-5xl lg:text-6xl font-normal text-[#1f2933] mb-6 leading-tight"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              Paint Their Plate <span className="text-[#14b8a6]">With Purpose</span>
            </h1>

            <p className="text-xl text-[#475467] mb-8 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Each color in our palette corresponds to specific gut-healing ingredients, so pet parents can finally see (not guess) how nutrition
              supports their dog&apos;s microbiome, skin, and mood.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {paletteBands.map((band) => (
                <div key={band.label} className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow border border-gray-100">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: band.color }} />
                  <span className="text-sm font-semibold text-[#3c3a47]">{band.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/nutrition-services"
                className="bg-[#14b8a6] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#0f9a8c] transition-colors shadow-lg text-center"
              >
                Build My Palette
              </Link>
              <Link
                href="/resources"
                className="bg-white text-[#14b8a6] border-2 border-[#14b8a6] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#14b8a6] hover:text-white transition-colors shadow-lg text-center"
              >
                Download Sample Guide
              </Link>
            </div>

            <div className="bg-[#fffaf0] border-l-4 border-[#f6ad55] p-4 rounded-r-lg shadow-sm">
              <p className="text-sm text-[#b45309]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <strong>Fast-track option:</strong> Palette Workshops run every Thursday with live Q&A and recipe demos.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#ecfeff]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-wide text-[#94a3b8]">Lab Snapshot</p>
                <h3 className="text-2xl font-semibold text-[#0f172a]">Microbiome Inputs</h3>
              </div>
              <Microscope className="w-10 h-10 text-[#14b8a6]" />
            </div>

            <div className="space-y-4 mb-8">
              {kitSteps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ecfeff] text-[#0f172a] flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{step.title}</p>
                    <p className="text-sm text-[#475467]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-[#14b8a6]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-[#475467] uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-[#14b8a6] mb-2">Functional Color Story</p>
            <h2 className="text-[38px] font-normal text-[#1f2933] leading-tight mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              The palette makes science feel tactile for overwhelmed pet parents.
            </h2>
            <p className="text-[15px] text-[#475467] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Instead of long lab printouts, Christie delivers a plate plan organized by color. Each swipe across the palette equals a
              step-by-step dosing instruction—so you know how much, when, and why.
            </p>
            <div className="space-y-4">
              {paletteBands.map((band) => (
                <div key={band.label} className="rounded-2xl p-5 shadow-sm border border-gray-100" style={{ backgroundColor: `${band.color}12` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-full border-2 border-white shadow-inner" style={{ backgroundColor: band.color }} />
                    <div>
                      <p className="text-lg font-semibold text-[#0f172a]">{band.label}</p>
                      <p className="text-sm text-[#64748b]">{band.focus}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#475467]">{band.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f8fafc] rounded-3xl p-8 shadow-inner border border-gray-100">
            <p className="text-sm font-semibold text-[#475467] mb-4">Daily Ritual Blocks</p>
            <div className="space-y-5 mb-6">
              {microActions.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#14b8a6]" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[#0f172a]">{item.title}</p>
                    <p className="text-sm text-[#475467]">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-[#f6ad55]" />
                <p className="text-base font-semibold text-[#0f172a]">Color to Clinic Bridge</p>
              </div>
              <p className="text-sm text-[#475467] mb-4">
                Share the palette PDF with your vet team or dermatologist; it includes nutrient density tables and lab values for fast alignment.
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                {badges.map((badge) => (
                  <div key={badge} className="text-xs font-semibold text-[#475467] bg-[#ecfeff] rounded-full px-3 py-2">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 py-16">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-[#14b8a6] uppercase">From Palette to Plate</p>
            <h2 className="text-[34px] font-normal text-[#1f2933]" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Precision sourcing + chef execution in every delivery.
            </h2>
            <p className="text-[15px] text-[#475467]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Once your palette is approved, our kitchen teams layer the prescribed colors into small-batch meals, toppers, and hydration
              boosters. Pick-up, local delivery, or nationwide shipping available.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Micro-lot veggies', detail: 'Harvested within 48 hrs' },
                { label: 'Sous vide proteins', detail: 'Lock in amino acids' },
                { label: 'Fermented boosts', detail: 'House-cultured for stability' },
                { label: 'Texture variety', detail: 'Keeps selective eaters curious' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-4 shadow border border-gray-100">
                  <p className="text-base font-semibold text-[#0f172a]">{item.label}</p>
                  <p className="text-sm text-[#64748b]">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-[#0f172a] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1e293b] transition-colors shadow"
              >
                Schedule Palette Preview Call
              </Link>
              <Link
                href="/testimonials"
                className="text-sm font-semibold text-[#14b8a6] hover:underline"
              >
                See palette case studies →
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                alt="Colorful Waggin Meals board"
                width={2560}
                height={1716}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Image
                src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
                alt="Fresh dog meal bowl"
                width={2560}
                height={1707}
                className="rounded-3xl object-cover w-full h-full shadow-xl"
              />
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#ecfeff] flex flex-col justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-[#94a3b8] mb-2">Palette Pilot Program</p>
                  <p className="text-3xl font-normal text-[#0f172a]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    6-week rebuild sprint
                  </p>
                  <p className="text-sm text-[#475467] mt-2">
                    Includes microbiome test, three custom meal rotations, and Christie on Voxer for real-time tweaks.
                  </p>
                </div>
                <Link href="/monthly-wag-box" className="text-sm font-semibold text-[#14b8a6] mt-4 hover:underline">
                  Explore what&apos;s inside →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold text-[#14b8a6] mb-2">Biome Color Palette™</p>
          <h2 className="text-[36px] font-normal text-[#1f2933] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Ready to stop color-coding spreadsheets and let us plate it for you?
          </h2>
          <p className="text-[15px] text-[#475467] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Whether you need a short-term rebuild or a long-term culinary partner, we&apos;ll match every hue to evidence-based nutrition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nutrition-services"
              className="bg-[#14b8a6] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#0f9a8c] transition-colors shadow-lg"
            >
              Start My Palette Design
            </Link>
            <Link
              href="/events"
              className="bg-white text-[#14b8a6] border-2 border-[#14b8a6] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#14b8a6] hover:text-white transition-colors shadow-lg"
            >
              Attend a Live Workshop
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#2f4b38] to-[#1f3324] text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/logo-waggin-meals.png"
                  alt="Waggin Meals"
                  width={50}
                  height={50}
                  className="rounded-full border border-[#ded2bf]"
                />
                <div>
                  <p className="text-sm font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                    Waggin Meals
                  </p>
                  <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Holistic Nutrition Studio
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed opacity-90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Specialized nutrition tailored to your dog's unique needs. Every meal scientifically formulated by Christie Webb, Certified Canine Nutritionist.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 opacity-90">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@wagginmeals.com" className="hover:text-[#f6a723] transition-colors">
                    info@wagginmeals.com
                  </a>
                </div>
                <div className="flex items-center gap-2 opacity-90">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-[#f6a723] transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li><Link href="/" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Home</Link></li>
                <li><Link href="/shop" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Shop</Link></li>
                <li><Link href="/nutrition-services" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Nutrition Services</Link></li>
                <li><Link href="/case-studies" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Success Stories</Link></li>
                <li><Link href="/blog" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Pet Nutrition Insights</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Resources
              </h3>
              <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li><Link href="/feeding-calculator" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Feeding Calculator</Link></li>
                <li><Link href="/guides/fresh-food-guide" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Fresh Food Guide</Link></li>
                <li><Link href="/resources" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Free PDF Guides</Link></li>
                <li><Link href="/faq" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">FAQs</Link></li>
                <li><Link href="/contact" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Contact Us</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Legal
              </h3>
              <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li><Link href="/shipping" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Shipping & Delivery</Link></li>
                <li><Link href="/privacy" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Privacy Policy</Link></li>
                <li><Link href="/terms" className="opacity-90 hover:text-[#f6a723] hover:opacity-100 transition-all">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="border-t border-white/20 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    FDA Pet Feed Program
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Licensed human-grade kitchen with documented batch tracking.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Christie Formulated
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Dual-master's Canine Integrative Animal Nutritionist oversight.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-[#f6a723] flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    AAFCO Complete
                  </p>
                  <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Balanced for dogs of every life stage with whole-food ingredients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/20">
            <p className="text-xs text-center opacity-90 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <strong>Important Information:</strong> At Waggin Meals, we believe your dog deserves real food made with love. Our <strong>Gently Cooked Human Grade Food for Dogs</strong> is approved through the <strong>FDA Pet Feed Program</strong> and scientifically formulated by an animal nutritionist to meet <strong>AAFCO standards for dogs of all ages</strong>. Our meals are formulated exclusively for dogs and are not intended for human consumption. Content on this site is for educational purposes only and not a substitute for veterinary advice. Always consult your veterinarian for health decisions about your dog.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p className="mb-2">
              © {new Date().getFullYear()} Waggin Meals Pet Nutrition Co. All rights reserved.
            </p>
            <p className="text-xs">
              Formulated by Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
