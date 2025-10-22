export function FounderStory() {
  return (
    <section className="py-20 bg-bg-light-blue">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Image placeholder - will add actual image later */}
          <div className="relative h-[400px] overflow-hidden rounded-lg bg-gradient-to-br from-primary-blue/20 to-accent-lavender/20">
            <div className="flex h-full items-center justify-center text-text-muted">
              <p className="text-center px-4">
                Founder photo with dog<br />
                (Image to be added)
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <blockquote className="relative mb-6">
              <span className="absolute -left-4 -top-4 text-6xl text-primary-blue opacity-20">
                "
              </span>
              <p className="relative text-lg italic leading-relaxed text-text-body">
                I do not try to compete with big box companies. What we offer is
                specialized nutrition, bite sizes, and do not mass produce. We
                actually care about your special dog needs. Research every entry you
                feed.
              </p>
            </blockquote>
            <p className="font-bold text-text-heading">
              — Christie A. Willett, M.A., M.S., Canine Integrative Animal
              Nutritionist, Owner of Waggin Meals
            </p>

            <div className="mt-8 space-y-4 text-text-body">
              <p>
                <strong>Christie's personal loss</strong> sparked her mission to
                create customized meal plans that help pets thrive.
              </p>
              <p>
                With two Master's degrees and pursuing her PhD in Animal
                Nutrition, Christie brings scientific rigor to every recipe while
                maintaining the heart and soul of home cooking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
