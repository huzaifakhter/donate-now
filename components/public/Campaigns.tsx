import Image from "next/image";
import Link from "next/link";

const CAMPAIGNS = [
  {
    id: 1,
    category: "Education",
    title: "Digital Literacy for Rural Youth",
    description: "Providing tablets and high-speed internet to community centers in underserved regions.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZot71bcu8Sc8MPJPKlNtWSSBB_AOBAu5Y1DqVEHP5cd85rg4vkdzw547qwDpqwSD49FmHuem0ej0s_AOtIA0PEYwbFWrQ70b25GWC-Sn2XTABlO8P1SFiWpKmWrA02_ZYj_7Sy_WdoOA5c7muKzrSyJn56DNsRFX53cfMsM4p8t9GTXWW_QzhJuAShdOqyAkZtjEgUoG9U2S-nFnztPmggeoIYDozYWL4f21dNE5ot_LM3SY7KW03f2oaE12rK2JVKaZFD9YltGs2",
    raised: 12450,
    goal: 15000,
    percent: 83,
  },
  {
    id: 2,
    category: "Medical",
    title: "Surgery Support for Maya",
    description: "Helping a 6-year-old athlete get the critical care she needs to walk again after an accident.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZhpqLW2VefZ_7L72-rfIUK77-AfRGbu2ymjofOXn5tDvNNqTbUJkPGWmx-EgyFLYtOpTloaPsBudNKmw9IObLUSe7C2ayNBzbiRXbpYKx5NVvLD3QFpN3TtHa5y9d-fYEQvVq22N-OSkNMYleKgoLO-3wkRuMgXB_zfEhACAbpmIc4yy41FZuI_P6KgUQGJZbg61h3coJaWHrrGOpbqjRDGuRDJQ-UjI1GUBZJK4o9v1ROJldK1IwuHYocCj3qlArq2Hbu_GANgoD",
    raised: 45000,
    goal: 60000,
    percent: 75,
  },
  {
    id: 3,
    category: "Emergency",
    title: "Flood Relief for Coastal Communities",
    description: "Immediate support for families displaced by recent extreme weather. Food, water, and shelter.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmK_qR-OiPTMElZd2gVZPjd3T4WH_-wgXVS-sYl8hQHalVvb21lmbri3OCfYHzZoPW6Cd4U0zL8hYsbG6_W_nCBQFMVrnBNHe8dlhfn0PUOCms3PhfQicYib0zMVfWQ_x3a_ltmCJ6AHjyHKttvOpRUEeDDWRMOf2z8SiAnkN1vcPGcPFjz1EwBBbdLxMgjEH-GhwZXSshAOyD6Np3IBm7deG_NfJm-MnjfgZU5ErdSYoV6KCu1X5AEZPraIivNkSZpKMs1aIcL6v0",
    raised: 8200,
    goal: 20000,
    percent: 41,
  },
];

export default function Campaigns() {
  return (
    <section className="w-full py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-stack-md">
          <div>
            <h2 className="font-headline-md text-headline-md md:text-display-lg-mobile text-on-surface font-bold">
              Featured Fundraisers
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Support verified causes that are making a real difference in the world today.
            </p>
          </div>
          <Link
            className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline font-semibold"
            href="#"
          >
            View All Categories
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {CAMPAIGNS.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl overflow-hidden card-shadow group border border-outline-variant/30 flex flex-col transition-all duration-300 hover:border-primary/20"
            >
              <div className="h-48 w-full bg-surface-container-low relative overflow-hidden">
                <Image
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={campaign.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-label-sm font-semibold">
                    {campaign.category}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 group-hover:text-primary transition-colors font-bold">
                  {campaign.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant mb-6 line-clamp-2">
                  {campaign.description}
                </p>
                <div className="mt-auto space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-label-sm">
                      <span className="font-bold text-on-surface">
                        ${campaign.raised.toLocaleString()} raised
                      </span>
                      <span className="text-on-surface-variant">
                        of ${campaign.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full progress-gradient rounded-full"
                        style={{ width: `${campaign.percent}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-2.5 rounded-lg hover:opacity-90 transition-all cursor-pointer font-semibold shadow-sm">
                    Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
