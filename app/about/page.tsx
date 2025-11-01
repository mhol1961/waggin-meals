import Image from 'next/image';
import Link from 'next/link';
import { generateMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Waggin Meals - from our farm shop in Western North Carolina to your dog\'s bowl. Premium fresh dog food and expert canine nutrition services.',
  keywords: ['about waggin meals', 'dog food company', 'North Carolina', 'fresh dog food', 'farm to bowl'],
  url: '/about',
});

export default function About() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6 leading-tight" style={{ fontFamily: "'Abril Fatface', serif" }}>
            From our Farm Shop in Western North Carolina to your dogs bowl!
          </h1>
        </div>
      </section>

      {/* Team Photo Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/images/2025/07/Beef-and-Sweet-Potato-Bowl-scaled.jpg"
              alt="Waggin Meals Team with dogs"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Christie Willett Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left - Images */}
            <div className="space-y-6">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/2025/07/Christie-7-16-25-11-copy.jpg"
                  alt="Christie Willett in the garden"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Christie Willett, Founder of Waggin Meals and M.A., M.S. in Agriculture
              </h2>

              <div className="space-y-4 text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <p>
                  <strong>Christie Willett</strong> is the heart and soul behind <strong>Waggin Meals Pet Nutrition Co.</strong> With a deep-rooted passion for animal well-being and nutrition science, Christie has dedicated her career to transforming the way we nourish our four-legged family members.
                </p>

                <p>
                  Christie holds a <strong>Master of Arts (M.A.)</strong> and <strong>Master of Science (M.S.)</strong> in Agriculture, specializing in Animal Nutrition. Currently pursuing her <strong>PhD in the chemistry of obesity, stress, and gerodietic nutrition in canines</strong>, she brings cutting-edge research and evidence-based practices to every meal she formulates.
                </p>

                <p>
                  What sets Christie apart is her personalized approach. She doesn't believe in one-size-fits-all solutions. Instead, she takes the time to understand each dog's unique needs—considering breed, age, weight, activity level, allergies, and medical conditions—to create <strong>customized meal plans that truly make a difference</strong>.
                </p>

                <p>
                  At Waggin Meals, Christie oversees every aspect of production in the farm kitchen, from sourcing <strong>sustainably raised, farm-fresh ingredients</strong> from local partners in the Blue Ridge Mountains, to hand-crafting small-batch meals with meticulous attention to detail.
                </p>

                <p>
                  Her commitment extends beyond the kitchen. Christie provides <strong>one-on-one nutrition consultations</strong>, helping pet parents navigate dietary transitions, address health concerns, and optimize their dog's nutrition for long-term vitality.
                </p>

                <p>
                  Christie's mission is simple yet powerful: <em>to nourish every bowl with science, compassion, and a genuine love for dogs.</em> She continues to innovate and expand Waggin Meals' offerings, always with the goal of giving pets the nutrition they deserve—and helping them thrive from the inside out.
                </p>

                <p className="text-[#a5b5eb] font-semibold">
                  When she's not in the kitchen or consulting with clients, you'll find Christie on the farm with her own pack, testing recipes and enjoying the simple joys of life in the mountains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ryan Agnello Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left - Content */}
            <div>
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Ryan Agnello, AKA CJ-Director of Office & Director of Operations
              </h2>

              <div className="space-y-4 text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <p>
                  <strong>Ryan Agnello</strong>, affectionately known as <strong>CJ</strong>, is the operational backbone of Waggin Meals Pet Nutrition Co. As <strong>Director of Office and Director of Operations</strong>, Ryan ensures that every aspect of the business runs smoothly—from production logistics to customer service excellence.
                </p>

                <p>
                  With a keen eye for detail and a talent for organization, Ryan oversees daily operations in the commercial farm kitchen, manages inventory, coordinates deliveries, and keeps the team on track. His dedication to efficiency and quality control means that every order leaves the kitchen with the same care and attention Christie puts into the recipes.
                </p>

                <p>
                  Ryan's background in <strong>business operations and logistics</strong> brings a professional edge to Waggin Meals, allowing Christie to focus on nutrition science while he handles the business side. But Ryan's role goes beyond spreadsheets and schedules—he's also a passionate advocate for animal welfare and shares Christie's commitment to providing dogs with the best possible nutrition.
                </p>

                <p>
                  When customers reach out with questions or concerns, they often hear from Ryan first. His friendly demeanor and problem-solving skills make him a favorite among Waggin Meals' loyal customer base.
                </p>

                <p className="text-[#a5b5eb] font-semibold">
                  Outside of work, Ryan enjoys spending time outdoors, exploring the beautiful Western North Carolina mountains, and of course, spending time with the Waggin Meals pack of dogs!
                </p>
              </div>
            </div>

            {/* Right - Image Placeholder */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/2025/07/Chicken-Superfood-Cake-Board-scaled.jpg"
                alt="Ryan Agnello"
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Where to Find It Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left - Image */}
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                  src="/images/2025/09/Canine-Nutrtion-Services.webp"
                  alt="Waggin Meals Farm Shop"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
                Where to Find It
              </h2>

              <div className="space-y-6 text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div>
                  <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3">Farm Shop Hours</h3>
                  <p>
                    <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM<br />
                    <strong>Saturday:</strong> 10:00 AM - 3:00 PM<br />
                    <strong>Sunday:</strong> Closed
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3">Visit Us</h3>
                  <p>
                    Our farm shop is located in beautiful Western North Carolina, where you can pick up fresh meals, meet our team, and learn more about our nutrition services.
                  </p>
                  <p className="mt-2">
                    <strong>Address:</strong><br />
                    Waggin Meals Pet Nutrition Co.<br />
                    Western North Carolina<br />
                    (Contact us for exact location)
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#a5b5eb] mb-3">Delivery & Shipping</h3>
                  <p>
                    We offer <strong>local delivery</strong> throughout Western North Carolina and <strong>nationwide shipping</strong> for our fresh, frozen meals. Free shipping on orders over $165!
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-block bg-[#a5b5eb] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#8a9fd9] transition-colors"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Dawg Mark Section */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Meet Dawg Mark
          </h2>

          <div className="space-y-4 text-[15px] text-[#3c3a47] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p>
              <strong>Dawg Mark</strong> is more than just a mascot—he's part of the Waggin Meals family and the official taste-tester for all our recipes! This lovable pup has been with Christie since the beginning, helping ensure every meal meets the highest standards of deliciousness.
            </p>

            <p>
              With his wagging tail and enthusiastic appetite, Dawg Mark embodies the joy and vitality that fresh, nutritious food can bring to our canine companions. He's living proof that when dogs eat well, they thrive!
            </p>
          </div>
        </div>
      </section>

      {/* A Glimpse Into Our Kitchen & Farm Shop */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-12 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            A Glimpse Into Our Kitchen & Farm Shop
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={`/images/2025/07/${i % 2 === 0 ? 'Beef-and-Sweet-Potato-Bowl' : 'Chicken-Superfood-Cake-Board'}-scaled.jpg`}
                  alt={`Farm shop photo ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-gradient-to-r from-[#5a6fa8] to-[#7a8fc5] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Let's Chat!
          </h2>
          <p className="text-lg text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Have questions about our meals, nutrition services, or want to schedule a farm visit?<br />
            We'd love to hear from you!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nutrition-services"
              className="inline-block bg-white text-[#a5b5eb] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Book a Consultation
            </Link>
            <Link
              href="https://wagginmeals.myshopify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#a5b5eb] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#8a9fd9] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
