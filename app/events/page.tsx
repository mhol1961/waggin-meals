'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Sample events - replace with actual event data or CMS integration
const upcomingEvents = [
  {
    id: 1,
    title: "Asheville Pet Expo",
    location: "Asheville, NC",
    address: "WNC Agricultural Center, 1301 Fanning Bridge Rd, Fletcher, NC 28732",
    date: "February 15-16, 2025",
    time: "10:00 AM - 6:00 PM",
    type: "Trade Show",
    description: "Meet us at booth #42! We'll be offering free nutrition consultations, product samples, and special show pricing on meal plans.",
    highlights: [
      "Free 15-minute nutrition consultations",
      "Product samples and demonstrations",
      "Special show discount: $50 off consultations",
      "Enter to win a free 3-month meal plan ($395 value)"
    ],
  },
  {
    id: 2,
    title: "Charlotte Dog Festival",
    location: "Charlotte, NC",
    address: "Freedom Park, 1908 East Blvd, Charlotte, NC 28203",
    date: "March 8, 2025",
    time: "9:00 AM - 4:00 PM",
    type: "Festival",
    description: "Join us for Charlotte's biggest dog festival! Christie will be available for quick nutrition Q&A throughout the day.",
    highlights: [
      "Free nutrition Q&A sessions (first come, first served)",
      "Bring your dog for a free body condition assessment",
      "Special festival pricing on supplements",
      "Treat samples for your pup"
    ],
  },
  {
    id: 3,
    title: "Greenville Farmers Market",
    location: "Greenville, SC",
    address: "Main Street, Greenville, SC 29601",
    date: "March 22, 2025",
    time: "8:00 AM - 1:00 PM",
    type: "Farmers Market",
    description: "Monthly pop-up at Greenville Farmers Market. Stop by for fresh meal samples and nutrition advice!",
    highlights: [
      "Fresh meal samples for dogs",
      "Pick up pre-ordered meals",
      "Book in-person consultations",
      "Local pickup available for orders"
    ],
  },
  {
    id: 4,
    title: "Knoxville Pet & Wellness Fair",
    location: "Knoxville, TN",
    address: "Chilhowee Park & Exposition Center, 3301 E Magnolia Ave, Knoxville, TN 37914",
    date: "April 12, 2025",
    time: "11:00 AM - 5:00 PM",
    type: "Wellness Fair",
    description: "Expanding to Tennessee! Come learn about fresh food nutrition and meet other local pet wellness vendors.",
    highlights: [
      "Educational seminar: \"Fresh Food 101\" at 2:00 PM",
      "Free consultation bookings for TN residents",
      "Network with local holistic vets",
      "Product demonstrations"
    ],
  },
];

const pastEvents = [
  {
    id: 5,
    title: "Raleigh Bark in the Park",
    location: "Raleigh, NC",
    date: "January 20, 2025",
    type: "Community Event",
  },
  {
    id: 6,
    title: "Spartanburg Holiday Pet Market",
    location: "Spartanburg, SC",
    date: "December 14, 2024",
    type: "Holiday Market",
  },
  {
    id: 7,
    title: "Boone Mountain Dog Festival",
    location: "Boone, NC",
    date: "October 5, 2024",
    type: "Festival",
  },
];

const eventTypes = ["All Events", "Trade Show", "Festival", "Farmers Market", "Wellness Fair", "Community Event"];

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState("All Events");

  const filteredEvents = selectedType === "All Events"
    ? upcomingEvents
    : upcomingEvents.filter(e => e.type === selectedType);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Events & Travel Schedule
          </h1>
          <p className="text-lg text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Come meet Christie in person! Find out where we'll be next.
          </p>
          <p className="text-sm text-white opacity-90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Serving communities across North Carolina, South Carolina, and Tennessee
          </p>
        </div>
      </section>

      {/* Quick Info Banner */}
      <section className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📍</div>
              <h3 className="font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                In-Person Consultations
              </h3>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Book appointments at events for sliding-scale pricing
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Special Event Offers
              </h3>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Exclusive discounts and giveaways only available at events
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🐾</div>
              <h3 className="font-semibold text-[#3c3a47] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Bring Your Dog
              </h3>
              <p className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Most events are dog-friendly! Check event details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Type Filter */}
      <section className="bg-[#f8f9fa] border-b border-gray-200 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? "bg-[#8FAE8F] text-white"
                    : "bg-white text-[#666666] hover:bg-gray-100"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Upcoming Events
          </h2>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                No upcoming {selectedType !== "All Events" && selectedType} events. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="bg-[#f8f9fa] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-6 p-8">
                    {/* Left - Date & Location */}
                    <div className="md:border-r md:border-gray-300 md:pr-6">
                      <div className="bg-[#8FAE8F] text-white inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {event.type}
                      </div>
                      <h3 className="text-2xl font-semibold text-[#3c3a47] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {event.title}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {event.date}
                            </p>
                            <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {event.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-[#8FAE8F] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <div>
                            <p className="text-sm font-semibold text-[#3c3a47]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {event.location}
                            </p>
                            <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {event.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Middle - Description & Highlights */}
                    <div className="md:col-span-2">
                      <p className="text-[15px] text-[#3c3a47] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {event.description}
                      </p>

                      <h4 className="font-semibold text-[#3c3a47] mb-3 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Event Highlights:
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {event.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#8FAE8F] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-sm text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-white border-2 border-[#8FAE8F] text-[#8FAE8F] px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#8FAE8F] hover:text-white transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Get Directions
                        </a>
                        <Link
                          href="/contact"
                          className="inline-block bg-[#8FAE8F] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#6d8c6d] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          Pre-Book Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-8 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Past Events
          </h2>
          <p className="text-center text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We've been proud to serve communities across the region
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg p-4 shadow">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#999999]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs text-[#999999]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {event.date}
                  </span>
                </div>
                <h4 className="font-semibold text-[#3c3a47] text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {event.title}
                </h4>
                <p className="text-xs text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {event.location}
                </p>
                <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request an Event */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Want to See Us in Your Area?
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We're always looking to connect with new communities! If you'd like us to visit your area
            for a farmers market, pet expo, or community event, let us know.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#8FAE8F] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6d8c6d] transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Request an Event in Your Area
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-normal text-[#3c3a47] mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Never Miss an Event
          </h2>
          <p className="text-[16px] text-[#666666] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Subscribe to get notified when we're coming to your area
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#8FAE8F]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            <button
              className="bg-[#8FAE8F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6d8c6d] transition-colors whitespace-nowrap"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Notify Me
            </button>
          </div>
        </div>
      </section>

      {/* Development Note */}
      <section className="bg-[#d1ecf1] px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start">
            <svg className="h-8 w-8 text-[#0c5460] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-[#0c5460] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Event Management
              </h3>
              <p className="text-[14px] text-[#0c5460]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Events can be managed by either:
              </p>
              <ul className="list-disc list-inside mt-2 text-[13px] text-[#0c5460] space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <li>Updating the events array in this file manually</li>
                <li>Integrating with Google Calendar API for automatic updates</li>
                <li>Using a headless CMS like Sanity or Contentful</li>
                <li>Adding an admin panel to create/edit events</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
