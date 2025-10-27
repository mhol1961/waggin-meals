"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ChevronDown,
  Gift,
  Star,
  MessageCircle,
  BadgePercent,
  ShoppingCart,
  Award,
  ShieldCheck,
  Droplets,
  Stethoscope,
  Leaf,
  Mail,
  Phone,
  Menu,
} from 'lucide-react';

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

const solutionCards = [
  {
    title: 'Gut Restore Program',
    pill: 'Best Seller',
    description: 'FMT capsules + à la carte meals to balance sensitive tummies fast.',
    stats: ['Clinician-guided', 'Ships weekly', '95% satisfaction'],
    cta: 'Shop Gut Restore',
    href: '/products',
  },
  {
    title: 'Skin + Microbiome Lab Kit',
    pill: 'New',
    description: 'Dual swab kit with color-coded palette translation for itchy pups.',
    stats: ['48 hr lab', 'Palette PDF', 'Vet-ready report'],
    cta: 'Schedule Kit Consult',
    href: '/nutrition-services',
  },
  {
    title: 'Rewards Pantry',
    pill: 'Members',
    description: 'Exclusive toppers, broths, and probiotic treats only for insiders.',
    stats: ['Earn points', 'Seasonal drops', 'VIP support'],
    cta: 'Join Better Biome Club',
    href: '/monthly-wag-box',
  },
];

const perkHighlights = [
  {
    icon: ShieldCheck,
    title: 'FDA Feed Program',
    detail: 'Human-grade kitchen meets regulatory guardrails.',
  },
  {
    icon: Droplets,
    title: 'Hydration Science',
    detail: 'Electrolyte gels + broth cubes tailored to palette gaps.',
  },
  {
    icon: Award,
    title: 'Dual Master’s Nutritionist',
    detail: 'Christie Willett M.A., M.S. oversees each microbatch.',
  },
];

export default function BiomeInspiredVariation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="bg-[#f5f2eb] min-h-screen">
      {/* Top Announcement */}
      <div className="bg-[#2f4b38] text-white text-center text-sm py-2">
        Free insulated tote on local deliveries over $165 · Palette workshop enrollment now open
      </div>

      {/* Navigation */}
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

      {/* Hero */}
      <section className="relative px-4 py-16 overflow-hidden bg-gradient-to-br from-[#f8f5ee] to-[#ecf4ee]">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#bc2c2c]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-[#205542]/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-[#bc2c2c] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              AnimalBiome inspired · Waggin-made
            </p>
            <h1 className="text-5xl lg:text-[58px] font-normal leading-tight text-[#1f2c24] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Transform Gut Data
              <br />
              Into Gorgeous Plates
            </h1>
            <p className="text-lg text-[#4b4f4b] leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Microbiome swabs, palette-based meal plans, and concierge nutrition coaching delivered with the refined greens and creams clients love
              from AnimalBiome—only tailored to the Waggin Meals brand and menu.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/nutrition-services"
                className="bg-[#2f4b38] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#203626] transition-colors shadow-lg"
              >
                Book Microbiome Consult
              </Link>
              <Link
                href="/shop"
                className="border-2 border-[#2f4b38] text-[#2f4b38] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2f4b38] hover:text-white transition-colors"
              >
                Shop Balanced Meals
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-3xl font-semibold text-[#bc2c2c]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  40% OFF
                </p>
                <p className="text-sm text-[#4b4f4b]">Palette Starter Kits</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  500+
                </p>
                <p className="text-sm text-[#4b4f4b]">Dogs reset since 2012</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-[#2f4b38]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  5.0★
                </p>
                <p className="text-sm text-[#4b4f4b]">Community reviews</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[32px] shadow-2xl border border-[#e5dfd1] overflow-hidden">
              <div className="px-8 py-6 bg-[#f8f5ee] flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#9c7a4a]">Featured Formula</p>
                  <h3 className="text-2xl font-semibold text-[#1f2c24]">Gut Restore Capsules</h3>
                </div>
                <BadgePercent className="w-10 h-10 text-[#bc2c2c]" />
              </div>
              <div className="p-6">
                <Image
                  src="/images/biome-example-hero-homepage.png"
                  alt="AnimalBiome inspiration board"
                  width={900}
                  height={630}
                  className="rounded-2xl border border-[#eee5d7]"
                />
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#647064]">Ships weekly · Vet portal ready</p>
                    <p className="text-lg font-semibold text-[#2f4b38]">$129 signature kit</p>
                  </div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#bc2c2c] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#a02424]"
                  >
                    Add to plan <ShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Testimonial Pop */}
            <div className="absolute -left-10 -bottom-10 bg-white rounded-2xl shadow-xl border border-[#e7dfcf] p-4 w-64">
              <div className="flex items-center gap-3 mb-3">
                <Image src="/images/woman-with-white-dog.webp" alt="Client & dog" width={54} height={54} className="rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2c24]">Augie + Leah</p>
                  <div className="flex text-[#f6a723]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#4b4f4b]">
                “IBD flare dropped in 2 weeks. The palette PDF helped our vet stay aligned with every ingredient swap.”
              </p>
            </div>
          </div>
        </div>

        {/* Rewards + Chat badges */}
        <div className="absolute left-6 bottom-6 flex items-center gap-4">
          <button className="flex items-center gap-2 bg-[#1f2c24] text-white px-4 py-3 rounded-full shadow-xl">
            <Gift className="w-5 h-5" />
            Rewards
          </button>
          <button className="bg-white text-[#2f4b38] px-3 py-3 rounded-full shadow-xl border border-[#dcd3c3]">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Concierge Programs</p>
              <h2 className="text-[38px] font-normal text-[#1f2c24]" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Designed around the AnimalBiome experience, customized for Waggin Meals.
              </h2>
            </div>
            <Link href="/hero-variations" className="text-sm font-semibold text-[#2f4b38] hover:underline">
              View all hero experiments →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutionCards.map((card) => (
              <div key={card.title} className="bg-[#f8f5ee] rounded-3xl border border-[#ebe1cf] p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wide bg-white px-3 py-1 rounded-full text-[#bc2c2c] font-semibold">{card.pill}</span>
                  <Star className="w-5 h-5 text-[#f6a723]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1f2c24] mb-3">{card.title}</h3>
                <p className="text-sm text-[#4b4f4b] mb-4">{card.description}</p>
                <ul className="space-y-2 mb-5">
                  {card.stats.map((stat) => (
                    <li key={stat} className="text-sm text-[#2f4b38] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bc2c2c]" />
                      {stat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f4b38] hover:text-[#bc2c2c]"
                >
                  {card.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-4 py-16 bg-[#f8f5ee]">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#ece2d1]">
            <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Palette Perks</p>
            <h3 className="text-[34px] font-normal text-[#1f2c24] mb-5" style={{ fontFamily: "'Abril Fatface', serif" }}>
              A creamy, grounded palette aligned with the Waggin Meals wagon + produce colors.
            </h3>
            <div className="space-y-4">
              {perkHighlights.map((perk) => (
                <div key={perk.title} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-[#2f4b38]">
                    <perk.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#1f2c24]">{perk.title}</p>
                    <p className="text-sm text-[#4b4f4b]">{perk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#ece2d1]">
            <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Palette At-A-Glance</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Cream Canvas', color: '#f5f2eb' },
                { label: 'Garden Pine', color: '#2f4b38' },
                { label: 'Harvest Carrot', color: '#d4542b' },
                { label: 'Heritage Wagon', color: '#a12323' },
              ].map((swatch) => (
                <div key={swatch.label} className="text-center">
                  <div className="w-full h-20 rounded-2xl border border-[#dcd3c3]" style={{ backgroundColor: swatch.color }} />
                  <p className="text-xs mt-2 text-[#4b4f4b]">{swatch.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#4b4f4b] mt-6">
              Colors mirror the Waggin Meals logo (cream field, evergreen typography, red wagon slats, and produce pops) while nodding to AnimalBiome’s
              modern apothecary vibe.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold text-[#bc2c2c] mb-2">Biome-inspired hero</p>
          <h2 className="text-[40px] font-normal text-[#1f2c24] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Want this aesthetic on the live homepage?
          </h2>
          <p className="text-[15px] text-[#4b4f4b] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Mix this variant with other experiments or cherry-pick the rewards/chat/testimonial flourishes. Colors remain true to Waggin Meals while
            channeling AnimalBiome’s calm medical confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#bc2c2c] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8f1c1c] transition-colors shadow-lg"
            >
              Request Implementation
            </Link>
            <Link
              href="/events"
              className="border-2 border-[#bc2c2c] text-[#bc2c2c] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#bc2c2c] hover:text-white transition-colors"
            >
              Join Palette Workshop
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
