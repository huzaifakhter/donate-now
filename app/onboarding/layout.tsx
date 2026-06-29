"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const steps = [
    { number: 1, label: "Organization Info", path: "/onboarding/step-1" },
    { number: 2, label: "Contact Details", path: "/onboarding/step-2" },
    { number: 3, label: "Upload Documents", path: "/onboarding/step-3" },
    { number: 4, label: "Banking Information", path: "/onboarding/step-4" },
    { number: 5, label: "Review & Submit", path: "/onboarding/step-5" },
  ];

  // Helper to check if step is active or completed
  const getStepStatus = (stepPath: string, stepNumber: number) => {
    const currentStepNum = steps.find(s => pathname.startsWith(s.path))?.number || 1;
    if (pathname.startsWith(stepPath)) return "active";
    if (currentStepNum > stepNumber) return "completed";
    return "upcoming";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-outline-variant/30 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display-lg text-headline-sm font-bold text-primary">
            Donate Now Onboarding
          </Link>
          <div className="text-sm text-on-surface-variant font-medium">
            Step {steps.find(s => pathname.startsWith(s.path))?.number || 1} of 5
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Sidebar */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-xl border border-outline-variant/30 card-shadow h-fit space-y-6">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            Verification Steps
          </h2>
          <nav className="space-y-4">
            {steps.map((step) => {
              const status = getStepStatus(step.path, step.number);
              return (
                <div key={step.number} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${
                      status === "active"
                        ? "bg-primary border-primary text-on-primary ring-2 ring-primary/20"
                        : status === "completed"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-surface-variant border-[#CBD5E1] text-on-surface-variant"
                    }`}
                  >
                    {status === "completed" ? (
                      <span className="material-symbols-outlined text-base font-bold">check</span>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold transition-all ${
                      status === "active"
                        ? "text-primary"
                        : status === "completed"
                        ? "text-emerald-600"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Form Container */}
        <main className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-outline-variant/30 p-6 md:p-8 card-shadow">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
