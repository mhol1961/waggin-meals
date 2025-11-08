import Image from 'next/image';
import Link from 'next/link';
import { getAllCollections, getCollectionsByType, Collection } from '@/data/collections';

export default function CollectionsPage() {
  const allCollections = getAllCollections();
  const proteinCollections = getCollectionsByType('protein');
  const mealTypeCollections = getCollectionsByType('meal-type');
  const healthGoalCollections = getCollectionsByType('health-goal');
  const dietTypeCollections = getCollectionsByType('diet-type');

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#8FAE8F] px-4 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop by Collection
          </h1>
          <p className="text-lg text-white max-w-3xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Find the perfect meals for your dog's needs. Browse by protein, meal type, health goal, or dietary preference.
          </p>
        </div>
      </section>

      {/* Browse by Protein */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop by Protein
          </h2>
          <p className="text-center text-[#666666] mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Choose your dog's favorite protein source or try a variety pack
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {proteinCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Meal Type */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop by Meal Type
          </h2>
          <p className="text-center text-[#666666] mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Complete meals, toppers, or supplements to enhance your dog's diet
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealTypeCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Health Goal */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop by Health Goal
          </h2>
          <p className="text-center text-[#666666] mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Support your dog's specific health needs with targeted nutrition
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthGoalCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Diet Type */}
      <section className="bg-[#f8f9fa] px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-normal text-[#3c3a47] mb-4 text-center" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Shop by Diet Type
          </h2>
          <p className="text-center text-[#666666] mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Special dietary needs? We've got you covered
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dietTypeCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#5a6fa8] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-normal text-white mb-6" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Need Help Choosing?
          </h2>
          <p className="text-lg text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Schedule a FREE nutrition consultation with Christie to find the perfect meals for your dog
          </p>

          <Link
            href="/nutrition-services"
            className="inline-block bg-white text-[#8FAE8F] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}

// Collection Card Component
function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {collection.featured && (
          <div className="absolute top-3 right-3 bg-[#ffc107] text-white px-3 py-1 rounded-full text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Popular
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#3c3a47] mb-2 group-hover:text-[#8FAE8F] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {collection.title}
        </h3>
        <p className="text-sm text-[#666666] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {collection.description}
        </p>
        <div className="flex items-center text-[#8FAE8F] font-semibold text-sm group-hover:text-[#6d8c6d]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Shop Now
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
