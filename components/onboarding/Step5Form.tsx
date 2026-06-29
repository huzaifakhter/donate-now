"use client";

import { useActionState } from "react";
import { submitOnboarding } from "@/app/actions/onboarding";
import { ArrowLeft, Check, FileText } from "lucide-react";
import Link from "next/link";

interface DocRecord {
  id: string;
  doc_type: string;
  file_url: string;
  file_name: string;
}

interface ProfileData {
  org_name: string | null;
  org_type: string | null;
  reg_number: string | null;
  year_established: number | null;
  website: string | null;
  contact_person: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
}

interface BankData {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  ifsc_swift: string;
  branch: string;
}

export default function Step5Form({
  profile,
  bank,
  docs,
  userEmail,
}: {
  profile: ProfileData | null;
  bank: BankData | null;
  docs: DocRecord[];
  userEmail: string;
}) {
  const [state, formAction, isPending] = useActionState(submitOnboarding, null);

  const docLabels: Record<string, string> = {
    reg_certificate: "Govt Registration Certificate",
    ngo_certificate: "NGO Certificate",
    tax_reg: "Tax Registration Certificate",
    id_proof: "Identity Proof",
    address_proof: "Address Proof",
    bank_proof: "Cancelled Cheque / Bank Proof",
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Review & Submit Application
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Please review all details before submitting. Once submitted, your application cannot be modified during review.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm font-medium text-red-800">{state.error}</div>
        </div>
      )}

      {/* Grid Summaries */}
      <div className="space-y-6">
        {/* Step 1 Summary */}
        <div className="border border-outline-variant/30 rounded-xl p-5 space-y-3 bg-[#FBFBFB]">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
            <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">
              1. Organization Info
            </h3>
            <Link href="/onboarding/step-1" className="text-xs font-bold text-secondary hover:underline">
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Legal Name</span>
              <span className="font-semibold text-on-surface">{profile?.org_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Organization Type</span>
              <span className="font-semibold text-on-surface">{profile?.org_type || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Registration Number</span>
              <span className="font-semibold text-on-surface">{profile?.reg_number || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Year Established</span>
              <span className="font-semibold text-on-surface">{profile?.year_established || "N/A"}</span>
            </div>
            {profile?.website && (
              <div className="md:col-span-2">
                <span className="text-xs font-semibold text-on-surface-variant block">Website</span>
                <span className="font-semibold text-primary break-all">{profile.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 Summary */}
        <div className="border border-outline-variant/30 rounded-xl p-5 space-y-3 bg-[#FBFBFB]">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
            <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">
              2. Contact Information
            </h3>
            <Link href="/onboarding/step-2" className="text-xs font-bold text-secondary hover:underline">
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Contact Person</span>
              <span className="font-semibold text-on-surface">{profile?.contact_person || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Phone Number</span>
              <span className="font-semibold text-on-surface">{profile?.phone || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Country / Region</span>
              <span className="font-semibold text-on-surface">{profile?.country || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">City, State</span>
              <span className="font-semibold text-on-surface">
                {profile?.city ? `${profile.city}, ${profile.state}` : "N/A"}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs font-semibold text-on-surface-variant block">Address</span>
              <span className="font-semibold text-on-surface">{profile?.address || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Step 3 Summary */}
        <div className="border border-outline-variant/30 rounded-xl p-5 space-y-3 bg-[#FBFBFB]">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
            <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">
              3. Verification Documents
            </h3>
            <Link href="/onboarding/step-3" className="text-xs font-bold text-secondary hover:underline">
              Edit
            </Link>
          </div>
          <div className="space-y-2">
            {docs && docs.length > 0 ? (
              docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm bg-white p-2.5 rounded-lg border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-on-surface-variant block uppercase tracking-wider">
                        {docLabels[d.doc_type] || d.doc_type}
                      </span>
                      <span className="text-xs text-on-surface font-semibold truncate max-w-xs block">{d.file_name}</span>
                    </div>
                  </div>
                  <a
                    href={d.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-secondary hover:underline mr-2"
                  >
                    View Document
                  </a>
                </div>
              ))
            ) : (
              <span className="text-sm font-semibold text-on-surface-variant">No documents uploaded.</span>
            )}
          </div>
        </div>

        {/* Step 4 Summary */}
        <div className="border border-outline-variant/30 rounded-xl p-5 space-y-3 bg-[#FBFBFB]">
          <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
            <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">
              4. Banking & Payouts Info
            </h3>
            <Link href="/onboarding/step-4" className="text-xs font-bold text-secondary hover:underline">
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Account Holder Name</span>
              <span className="font-semibold text-on-surface">{bank?.account_holder_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Bank Name</span>
              <span className="font-semibold text-on-surface">{bank?.bank_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Account Number</span>
              <span className="font-semibold text-on-surface">{bank?.account_number || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">IFSC / SWIFT</span>
              <span className="font-semibold text-on-surface">{bank?.ifsc_swift || "N/A"}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block">Branch Location</span>
              <span className="font-semibold text-on-surface">{bank?.branch || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Submission */}
      <form action={formAction} className="flex justify-between pt-6 border-t border-outline-variant/20">
        <Link
          href="/onboarding/step-4"
          className="border border-[#CBD5E1] text-on-surface-variant font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {isPending ? "Submitting Application..." : "Submit Verification Application"}
        </button>
      </form>
    </div>
  );
}
