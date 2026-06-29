import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full py-section-gap overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-6 space-y-stack-lg">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
            Empower the Causes <br />
            <span className="text-primary font-bold">You Care About</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Donate Now is the modern, transparent platform for collective action. Whether it's a local community
            garden or global crisis relief, we make giving simple, direct, and incredibly impactful.
          </p>
          <div className="flex flex-wrap gap-stack-md pt-stack-sm">
            <Link
              href="/login"
              className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer text-center"
            >
              Start a Fundraiser
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
            <Link
              href="/login"
              className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-6 py-3 rounded-lg hover:opacity-90 transition-all cursor-pointer text-center"
            >
              Explore Causes
            </Link>
          </div>
          <div className="flex items-center gap-4 pt-stack-md">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high overflow-hidden relative">
                <Image
                  alt="User"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdZjrGerOFdV3dg7XGlWSer3Lf-9-W8xhMelLFdFAGi5qF8kJeHkJ-9VNXYg66pEG7U3NvC4Fi7rO59XUpiJDPWhYvwyyArFHXTapFBbD06-IQTsI0XQ3woJi5Y4sHIoE3pdLup8V8nPohXZgSDmGEe5ipXXlWy2qNtREkYKYmuu8jWHCcFDszpb1sernz_ZLPe87pq4SWs3qzOL1QPaLrcczfFtkpv9iAIPtCexK8b8Dzk3S4UEd6no7xQCoMBUjk6xlBO54cbrDZ"
                  width={40}
                  height={40}
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high overflow-hidden relative">
                <Image
                  alt="User"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnTPQ94vEkLRJWG-G6yASfOBBWPg3ok00Cd-0sRg_9Qxb4U9NpScnOKIooRYA2WcnDI5-CBPU7YWl44Ziqw2gWDr-cjkJ_uqkow1SUcePr29Ci1vUGJyy_8hZNMTf6AMeSy4dfX9MsezPtGoBAAf0hCgSAxqfMm74oii7cByrXjMMarwiW3WYWxogagtvYBNdH_y22MP0XRelRX7ODAGiHyXfbtMZ1xZMYyuAdud5Ya39whHe6a4MRMYe5Pmtk0_wRHTNaLEGfRKPr"
                  width={40}
                  height={40}
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high overflow-hidden relative">
                <Image
                  alt="User"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn0uFoBzDkKVzL4rECgyMKm1R23pioREvGUt4jVyB6V67SyiqBaVj8rlWQgqxnEXPcfgqUXLlwXdT-eiKc4hJJ98edqwMB8ChliXVTqf8ETbLHkmBrSGHTxNC99lnwvbs_J_rCrywFgjoePp6Apsp7bmVgGf58gBHbBpjZlO31jAV3pNnvRCNQEex432AJWXG64djrO7EOyKruI_t5eZWtDFhonxvpvmHvLAAuB7IabMeXYyGJDZ2LPaY09EFIGP2LET0IQ_eBc3fb"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Joined by <span className="font-bold text-primary">12k+</span> donors this month
            </p>
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <div className="rounded-xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 card-shadow bg-surface-container-low relative w-full aspect-[4/3]">
            <Image
              alt="Community Project"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWdo7fBoRoGF1laQO-DGze7C7nlcpPFPqIjOlWJV0OrWMHOc7MJ_D41vrjr1M_7oyuqcSzFOfFpZU-Sm_px4SHAbYN9CRcNjNYqjsdTDhsKGTLibTQnKftESC6Ctd4F5fYZ_RIjOcMbT7VMi034_r1MrluItCz0Qwgkc-1v0rrIZE3JTSHqTOEKV_vdvSQsgz1lcj_9MECCXCaIaNghNetDoF6wxC-qQkkLPv6VSwK5s-So0RoSGrCpJhPjpM4yAYklsij4AjjfRfP"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Decorative Element */}
          <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl card-shadow hidden md:block z-10 border border-outline-variant/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
              </div>
              <div>
                <p className="text-headline-sm font-headline-sm text-on-surface font-bold">$2.4M+</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Raised for local projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
