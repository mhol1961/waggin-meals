"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calculator, FileText, Video, Check, Lightbulb, ShieldCheck, Stethoscope, Leaf, Mail, Phone, ChevronDown, Menu } from 'lucide-react';

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

export default function ScienceEducatorFullPage() {
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

      {/* HERO: VARIATION C - THE SCIENCE EDUCATOR */}
      <section className="relative bg-gradient-to-br from-[#f0f9ff] via-white to-[#fef3c7] px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-5 py-2 mb-6">
                <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-blue-700">Evidence-Based Pet Nutrition Education</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-normal text-[#3c3a47] mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
                <span className="text-[#3b82f6]">Learn</span> the Science.{' '}
                <span className="text-[#f59e0b]">Feed</span> with Confidence.
              </h1>

              <p className="text-xl text-[#666666] mb-8 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Master the principles of canine nutrition with <strong>science-based resources, tools, and guidance</strong> from Christie Willett, M.S.—so you can make informed decisions about your dog's diet.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {title: 'No Overwhelm, Just Clarity', desc: 'Cut through conflicting advice with research-backed guidance'},
                  {title: 'Practical Tools & Resources', desc: 'Feeding calculators, fresh food guides, and step-by-step instructions'},
                  {title: 'DIY or Done-With-You', desc: 'Learn independently or book a consultation when you need expert guidance'}
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#3c3a47] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#666666]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/resources" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-center">
                  Access Free Resources
                </Link>
                <Link href="/nutrition-services" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors shadow-lg text-center">
                  Book Expert Guidance
                </Link>
              </div>

              <div className="inline-flex items-center bg-white rounded-lg shadow-md px-6 py-3 border border-gray-100">
                <div className="mr-4">
                  <p className="text-sm font-semibold text-[#3c3a47]">Christie A. Willett, M.A., M.S.</p>
                  <p className="text-xs text-[#a5b5eb]">15+ Years Teaching Pet Nutrition</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {icon: BookOpen, color: 'blue', title: 'Fresh Food Feeding Guide', desc: 'Complete guide to transitioning and feeding fresh food safely', href: '/guides/fresh-food-guide'},
                {icon: Calculator, color: 'amber', title: 'Feeding Calculator', desc: "Calculate exact portions based on your dog's age, weight, and activity", href: '/feeding-calculator'},
                {icon: FileText, color: 'green', title: 'Nutrition Articles & Blog', desc: 'Evidence-based insights on puppies, weight management, and more', href: '/blog'},
                {icon: Video, color: 'purple', title: 'Events & Workshops', desc: 'Join live sessions and learn directly from Christie', href: '/events'}
              ].map((resource, i) => (
                <div key={i} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-${resource.color}-600`}>
                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-${resource.color}-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4`}>
                      <resource.icon className={`w-6 h-6 text-${resource.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#3c3a47] mb-2">{resource.title}</h3>
                      <p className="text-sm text-[#666666] mb-3">{resource.desc}</p>
                      <Link href={resource.href} className={`text-sm font-semibold text-${resource.color}-600 hover:underline`}>
                        Read Guide →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-normal text-[#3c3a47] mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>Trusted by Thousands of Pet Parents</h2>
              <p className="text-[#666666]">Join a community of educated pet owners making informed nutrition choices</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{num: '10K+', label: 'Guide Downloads'}, {num: '500+', label: 'Dogs Thriving'}, {num: '2', label: "Master's Degrees"}, {num: '15+', label: 'Years Teaching'}].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>{stat.num}</div>
                  <div className="text-sm text-[#666666]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-center">
            {['Evidence-Based', 'Free Resources', 'Expert Support Available', 'No Fluff, Just Science'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                <span className="text-sm font-semibold text-[#666666]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <Image src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg" alt="Beef and Sweet Potato Bowl" width={2560} height={1707} className="rounded-md" priority />
              <Image src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg" alt="Chicken Superfood Board" width={2560} height={1716} className="rounded-md" />
            </div>
            <div className="space-y-10 lg:pt-20">
              <h2 className="text-[43px] font-normal leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>Doggy Farm Kitchens weren't a thing ~ until now!</h2>
              {[
                {title: 'Farm-Fresh & Sustainably Sourced', desc: 'Highest-quality ingredients from our own farms and trusted partners—because your pet deserves the best.'},
                {title: 'Nutritionist-Formulated, Handcrafted', desc: 'Created by an Animal Nutritionist and prepared in our commercial farm kitchen using advanced animal science.'},
                {title: 'Whole-Body Wellness', desc: 'Our meals support overall health, boost immunity, and help your dog thrive from the inside out.'}
              ].map((feature, i) => (
                <div key={i}>
                  <h4 className="mb-4 text-[18px] font-semibold text-[#3c3a47]">{feature.title}</h4>
                  <p className="text-[15px] italic leading-relaxed text-[#3c3a47]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 text-[60px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
          <blockquote className="mb-8 text-[18px] italic leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            I do not try to compete with big box companies. What we offer is specialized nutrition. We listen, and do not use computer generated responses to determine what your special dog needs. Because every dog is different.
          </blockquote>
          <p className="text-[15px] font-semibold text-[#3c3a47]">– Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist</p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <h2 className="text-center text-[35px] font-semibold text-[#333333] mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>Happy Customers & Waggin Tails</h2>
        <div className="mx-auto max-w-[1080px] grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {quote: "\"Our dog Maisy absolutely devours the fresh meals that Christie prepares. Can't recommend her enough.\"", author: 'Matt Wolfe + Maisy'},
            {quote: '"Christie is so helpful, kind & very knowledgeable about canine nutrition!"', author: 'Elizabeth Joslin'},
            {quote: '"My dogs love this food!! I know both are getting the best quality ingredients."', author: 'Amber Munoz'},
            {quote: '"Top notch, healthiest possible dog meals! The new location is fantastic!!"', author: 'Thom Slater'}
          ].map((t, i) => (
            <div key={i} className="bg-white p-6">
              <div className="mb-4 text-[48px] leading-none text-[#a5b5eb] opacity-30">&quot;</div>
              <p className="mb-4 text-[15px] leading-relaxed text-[#3c3a47]">{t.quote}</p>
              <p className="text-[14px] font-semibold text-[#3c3a47]">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-12">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>Variation C: The Science Educator</h2>
          <p className="text-lg mb-6">This approach emphasizes education and empowerment for DIY owners who want to learn. It positions Christie as a trusted educator while offering resources and optional expert guidance.</p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Best For</h3>
              <p className="text-sm">Knowledge-seekers and educated DIY pet owners</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Emotional Appeal</h3>
              <p className="text-sm">Empowerment through knowledge and confidence</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Primary CTA</h3>
              <p className="text-sm">Access Free Resources / Book Consultation</p>
            </div>
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
