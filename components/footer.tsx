import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, ShieldCheck, Award, Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#5E3B76] to-[#452a6d] text-white mt-16">
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
                className="rounded-full border border-[#ead9ff]"
              />
              <div>
                <p className="text-sm font-bold" style={{ fontFamily: "'Abril Fatface', serif" }}>
                  Waggin Meals
                </p>
                <p className="text-xs opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Healthy Gut = Clean Butt
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed opacity-90 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Specialized nutrition tailored to your dog's unique needs. Every meal scientifically formulated by Christie Webb, M.S. Animal Nutrition & M.A. Food Science.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 opacity-90">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@wagginmeals.com" className="hover:text-[#e6b4ff] transition-colors">
                  info@wagginmeals.com
                </a>
              </div>
              <div className="flex items-center gap-2 opacity-90">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-[#e6b4ff] transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li><Link href="/" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Home</Link></li>
              <li><Link href="/shop" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Shop</Link></li>
              <li><Link href="/nutrition-services" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Nutrition Services</Link></li>
              <li><Link href="/case-studies" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Success Stories</Link></li>
              <li><Link href="/blog" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Pet Nutrition Insights</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Resources
            </h3>
            <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li><Link href="/feeding-calculator" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Feeding Calculator</Link></li>
              <li><Link href="/guides/fresh-food-guide" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Fresh Food Guide</Link></li>
              <li><Link href="/resources" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Free PDF Guides</Link></li>
              <li><Link href="/faq" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">FAQs</Link></li>
              <li><Link href="/contact" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Legal
            </h3>
            <ul className="space-y-2 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li><Link href="/shipping" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Shipping & Delivery</Link></li>
              <li><Link href="/privacy" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Privacy Policy</Link></li>
              <li><Link href="/terms" className="opacity-90 hover:text-[#e6b4ff] hover:opacity-100 transition-all">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
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
              <Award className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Christie Formulated
                </p>
                <p className="text-xs opacity-80" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Oversight from a dual master's-degreed canine integrative animal nutritionist.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-[#e6b4ff] flex-shrink-0" />
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
  );
}
