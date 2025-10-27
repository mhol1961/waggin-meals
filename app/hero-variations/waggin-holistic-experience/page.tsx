"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, MessageCircle, Sparkles, Star, CalendarDays, X, CheckCircle2, ShieldCheck, Stethoscope, Leaf, Mail, Phone, ChevronDown, Menu } from 'lucide-react';

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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
