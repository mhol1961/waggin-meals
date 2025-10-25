'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Message sent successfully! We\'ll get back to you within 24 hours.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or email us directly at wagginmeals@gmail.com'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Get in Touch
          </h1>
          <p className="text-lg text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Have questions about our meals or nutrition services? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Phone */}
            <div className="text-center p-6 bg-[#f8f9fa] rounded-lg">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 003.48.56 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.56 3.48 1 1 0 01-.27 1.11l-2.17 2.2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Phone
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Call us for immediate assistance
              </p>
              <a href="tel:+18285551234" className="block mt-3 text-[#a5b5eb] font-semibold hover:text-[#8a9fd9]">
                (828) 555-1234
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-6 bg-[#f8f9fa] rounded-lg">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Email
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Send us a message anytime
              </p>
              <a href="mailto:info@wagginmeals.com" className="block mt-3 text-[#a5b5eb] font-semibold hover:text-[#8a9fd9]">
                info@wagginmeals.com
              </a>
            </div>

            {/* Location */}
            <div className="text-center p-6 bg-[#f8f9fa] rounded-lg">
              <div className="mb-4 flex justify-center">
                <svg className="h-12 w-12 text-[#a5b5eb]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Location
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Asheville, NC
              </p>
              <p className="mt-3 text-[13px] text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Local delivery & pickup available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Consultation Callout */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] rounded-2xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="text-5xl mb-4">🐾</div>
              <h2 className="text-3xl font-normal text-white mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Looking for Personalized Nutrition Advice?
              </h2>
              <p className="text-lg text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Schedule a <strong>free consultation</strong> with our certified canine nutritionist!
                We'll create a custom nutrition plan tailored to your pet's unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact-expert"
                  className="bg-white text-[#a5b5eb] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#f8f9fa] transition-colors inline-block"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Request Free Consultation
                </Link>
                <span className="text-white text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  or use the quick contact form below
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
              Send Us a Message
            </h2>
            <p className="text-center text-[15px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            {/* Success/Error Messages */}
            {submitStatus.type && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'bg-red-50 border-l-4 border-red-500'
              }`}>
                <div className="flex items-start">
                  <svg
                    className={`h-6 w-6 flex-shrink-0 ${
                      submitStatus.type === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {submitStatus.type === 'success' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    )}
                  </svg>
                  <p className={`ml-3 text-sm ${
                    submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {submitStatus.message}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-[#3c3a47] mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[#e0e0e0] focus:outline-none focus:border-[#a5b5eb] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#3c3a47] mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border-2 border-[#e0e0e0] focus:outline-none focus:border-[#a5b5eb] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-[#3c3a47] mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[#e0e0e0] focus:outline-none focus:border-[#a5b5eb] disabled:bg-gray-100 disabled:cursor-not-allowed resize-y"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  placeholder="Tell us about your dog and how we can help..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#a5b5eb] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#8a9fd9] transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>

              {/* SMTP Configuration Note */}
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-left">
                <p className="text-[13px] text-blue-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Note:</strong> To enable email delivery, add SMTP credentials to your <code>.env.local</code> file:
                  <br />
                  <code className="text-xs">SMTP_USER=your-email@gmail.com</code>
                  <br />
                  <code className="text-xs">SMTP_PASS=your-app-password</code>
                  <br />
                  <span className="text-xs">For Gmail, use an app-specific password: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">Generate here</a></span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What are your business hours?
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We're available Monday through Friday, 9 AM to 5 PM EST. We respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Do you offer nutrition consultations?
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Yes! Christie, our Canine Integrative Animal Nutritionist, offers personalized consultations. <a href="/nutrition-services" className="text-[#a5b5eb] underline hover:text-[#8a9fd9]">Learn more about our nutrition services</a>.
              </p>
            </div>

            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                What delivery options do you offer?
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                We offer local delivery and pickup in the Asheville, NC area, plus nationwide shipping for orders over $165 (free shipping applies).
              </p>
            </div>

            <div className="p-6 bg-[#f8f9fa] rounded-lg">
              <h3 className="text-lg font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                How do I customize a meal plan for my dog?
              </h3>
              <p className="text-[15px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Start with our <a href="/feeding-calculator" className="text-[#a5b5eb] underline hover:text-[#8a9fd9]">feeding calculator</a> to determine portion sizes, then reach out to us for a personalized meal plan consultation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
