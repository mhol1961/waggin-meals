"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, MessageCircle, CheckCircle2, X, ShieldCheck, Stethoscope, Leaf, Mail, Phone, ChevronDown, Menu } from 'lucide-react';

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

// Navigation structure with dropdowns
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
      { label: 'Feeding Calculator', href: '/feeding-calculator' },
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
  { label: 'Contact', href: '/contact' },
];

export default function WagginBiomeFusionPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow mouse movement to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 400); // 400ms delay for longer dropdowns
  };

  return (
    <main className="bg-[#f5f1ea] min-h-screen">
      {/* Announcement */}
      <div className="bg-[#2f4b38] text-white text-center text-sm py-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
        Local deliveries include our insulated tote · Palette workshops every Thursday · Free shipping over $165
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white px-4 py-5 border-b border-[#e5ddce] shadow-sm">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdown ? (
                    <>
                      <button className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-[#2f4b38] px-3 py-2 hover:text-[#bc2c2c] transition-colors">
                        {item.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {activeDropdown === item.label && (
                        <div
                          className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-[#e5ddce] py-2 z-50"
                          onMouseEnter={() => handleMouseEnter(item.label)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {item.dropdown.map((dropdownItem) => (
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
                      className="text-sm font-semibold uppercase tracking-wide text-[#2f4b38] px-3 py-2 hover:text-[#bc2c2c] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2f4b38] hover:bg-[#f5f1ea] rounded-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pb-3 border-t border-[#e5ddce] pt-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-[#bc2c2c]">
                        {item.label}
                      </div>
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="block pl-8 pr-4 py-2 text-sm text-[#2f4b38] hover:bg-[#f5f1ea] transition-colors rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#2f4b38] hover:bg-[#f5f1ea] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

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
                  src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                  alt="Chicken superfood board"
                  width={2560}
                  height={1600}
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
