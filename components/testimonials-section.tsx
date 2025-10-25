const testimonials = [
  {
    quote:
      "Our dog Misty loves Waggin Meals! And it's satisfying to see how much she looks forward to and gets excited for this company. Can't recommend Waggin Meals highly enough!",
    author: 'Mark Smith - Missy',
  },
  {
    quote:
      'Our large pup loves these food pouches. The ingredients are top-notch and her genuinely seems to get full off them, which is impressive. They also offer a product without the standard chicken products which is rare.',
    author: 'Elizabeth James',
  },
  {
    quote:
      'We dogs love this food! Mom got the variety package and literally we gobbled up each one in record time. We love them all but the treat of the meal is the carrots!',
    author: 'Buster Brown',
  },
  {
    quote:
      'Highly prepared fresh dog food! Certified and experienced professional. Made from scratch with lots of care about your pets and your family.',
    author: 'Donna Baker',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-text-heading">
          Happy Customers & Waggin Tails
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-card bg-white p-6 shadow-card transition-transform hover:scale-105"
            >
              <div className="mb-4 text-4xl text-primary-blue opacity-20">"</div>
              <p className="mb-4 text-sm leading-relaxed text-text-body">
                {testimonial.quote}
              </p>
              <p className="text-xs font-bold text-text-heading">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
