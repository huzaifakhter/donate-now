export default function Trust() {
  return (
    <section className="w-full py-section-gap bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-section-gap items-center">
        <div className="order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-gutter">
            <div className="bg-white p-6 rounded-xl card-shadow border border-outline-variant/20">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                Secure Payments
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                Bank-level encryption and secure payment gateways for every transaction.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow border border-outline-variant/20 mt-8">
              <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center text-secondary mb-4">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                Identity Proof
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                Rigorous verification process for all fundraiser organizers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow border border-outline-variant/20">
              <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center text-tertiary mb-4">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                Radical Transparency
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                Detailed financial reports showing exactly where every dollar goes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow border border-outline-variant/20 mt-8">
              <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant mb-4">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-semibold">
                24/7 Support
              </h4>
              <p className="text-body-sm text-on-surface-variant">
                Our dedicated trust team is always here to help you and your donors.
              </p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-stack-lg">
          <span className="text-primary font-label-md text-label-md uppercase tracking-wider block font-semibold">
            Reliability First
          </span>
          <h2 className="font-headline-md text-headline-md md:text-display-lg-mobile text-on-surface leading-tight font-bold">
            Giving is Built on <span className="text-secondary font-bold">Trust</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            We believe that the best way to encourage generosity is to prove that it matters. Our platform is built
            from the ground up to provide total clarity on fund usage and organizer legitimacy.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-on-surface font-semibold text-body-md">
              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
              Zero hidden fees for donors
            </li>
            <li className="flex items-center gap-3 text-on-surface font-semibold text-body-md">
              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
              Real-time donor dashboards
            </li>
            <li className="flex items-center gap-3 text-on-surface font-semibold text-body-md">
              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
              Fraud protection guarantee
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
