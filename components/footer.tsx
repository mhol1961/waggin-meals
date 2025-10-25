import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] py-12 border-t border-[#e0e0e0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Our Promise */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Promise
            </h3>
            <p className="text-sm leading-relaxed text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We don&apos;t compete with big box companies. What we offer is <strong>specialized nutrition</strong>. We listen, and do not use computer-generated responses to determine what your special dog needs. <strong>Because every dog is different.</strong> Our meals are scientifically formulated by a Canine Integrative Animal Nutritionist using farm-fresh, sustainably sourced ingredients.
            </p>
          </div>

          {/* Important Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Important Info
            </h3>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/shipping"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/faq"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/contact"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/privacy"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/terms"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#a5b5eb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/about"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Let&apos;s Chat!
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/shop"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="/nutrition-services"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                >
                  Nutrition Services
                </Link>
              </li>
              <li className="border-l-2 border-[#a5b5eb] pl-3">
                <Link
                  href="https://shopify.com/75736613077/account"
                  className="text-[#3c3a47] hover:text-[#a5b5eb] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-[#e0e0e0] pt-8 text-center text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <p>
            © {new Date().getFullYear()} Waggin Meals Pet Nutrition Co. All rights reserved.
          </p>
          <p className="mt-2 text-xs">
            Formulated by Christie A. Willett, M.A., M.S., Canine Integrative Animal Nutritionist
          </p>
        </div>
      </div>
    </footer>
  );
}
