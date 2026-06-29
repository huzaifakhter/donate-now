import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-primary-container rounded-3xl p-12 md:p-20 text-center relative overflow-hidden flex flex-col items-center">
          {/* Subtle background pattern/mesh using CSS */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary-container relative z-10 max-w-3xl mb-stack-lg font-bold">
            Ready to make a change? Start your journey today.
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 relative z-10 max-w-xl mb-12">
            It takes less than 5 minutes to launch your cause and reach a community ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-stack-md relative z-10 w-full sm:w-auto">
            <Link
              href="/login"
              className="bg-primary text-on-primary font-label-sm text-label-sm px-8 py-4 rounded-xl hover:shadow-xl transition-all font-bold cursor-pointer shadow-sm text-center"
            >
              Start a Fundraiser Now
            </Link>
            <Link
              href="/login"
              className="bg-white/20 backdrop-blur-md border border-white/30 text-on-primary-container font-label-sm text-label-sm px-8 py-4 rounded-xl hover:bg-white/30 transition-all cursor-pointer text-center"
            >
              How it Works
            </Link>
          </div>
          {/* Floating elements for visual interest */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
