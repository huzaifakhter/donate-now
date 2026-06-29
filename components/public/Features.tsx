export default function Features() {
  return (
    <section className="w-full py-section-gap bg-white">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center space-y-stack-sm mb-16">
          <span className="text-primary font-label-md text-label-md uppercase tracking-wider block font-semibold">
            Our Process
          </span>
          <h2 className="font-headline-md text-headline-md md:text-display-lg-mobile text-on-surface font-bold">
            How it Works
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Three simple steps to transform your vision into reality with the support of a global community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Step 1 */}
          <div className="group p-8 rounded-xl border border-outline-variant hover:border-primary transition-all duration-300 bg-surface-container-lowest">
            <div className="w-14 h-14 bg-surface-container-high rounded-lg flex items-center justify-center mb-stack-lg group-hover:bg-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-2xl">
                edit_note
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm font-semibold">
              1. Create
            </h3>
            <p className="text-on-surface-variant text-body-md">
              Start your fundraiser in minutes with our intuitive setup. Add photos, tell your story, and set your goal.
            </p>
          </div>
          {/* Step 2 */}
          <div className="group p-8 rounded-xl border border-outline-variant hover:border-primary transition-all duration-300 bg-surface-container-lowest">
            <div className="w-14 h-14 bg-surface-container-high rounded-lg flex items-center justify-center mb-stack-lg group-hover:bg-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-2xl">
                share
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm font-semibold">
              2. Share
            </h3>
            <p className="text-on-surface-variant text-body-md">
              Use our built-in tools to reach your network on social media and beyond. Transparency builds trust.
            </p>
          </div>
          {/* Step 3 */}
          <div className="group p-8 rounded-xl border border-outline-variant hover:border-primary transition-all duration-300 bg-surface-container-lowest">
            <div className="w-14 h-14 bg-surface-container-high rounded-lg flex items-center justify-center mb-stack-lg group-hover:bg-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-2xl">
                trending_up
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm font-semibold">
              3. Raise
            </h3>
            <p className="text-on-surface-variant text-body-md">
              Receive funds directly and securely. Watch the progress bar grow as people rally around your cause.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
