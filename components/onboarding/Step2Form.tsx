"use client";

import { useActionState } from "react";
import { saveStep2 } from "@/app/actions/onboarding";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProfileData {
  contact_person: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
}

export default function Step2Form({
  initialProfile,
}: {
  initialProfile: ProfileData | null;
}) {
  const [state, formAction, isPending] = useActionState(saveStep2, null);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Contact Information
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Provide contact information so we can reach you if additional details are needed.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm font-medium text-red-800">{state.error}</div>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-semibold text-on-surface-variant">
              Contact Person Full Name
            </label>
            <input
              id="contactPerson"
              name="contactPerson"
              type="text"
              required
              defaultValue={initialProfile?.contact_person || ""}
              placeholder="e.g. Jane Smith"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-on-surface-variant">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue={initialProfile?.phone || ""}
              placeholder="e.g. +1 (555) 123-4567"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-on-surface-variant">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              defaultValue={initialProfile?.country || ""}
              placeholder="e.g. United States"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-on-surface-variant">
              State / Region
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              defaultValue={initialProfile?.state || ""}
              placeholder="e.g. California"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-on-surface-variant">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              defaultValue={initialProfile?.city || ""}
              placeholder="e.g. San Francisco"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-on-surface-variant">
            Full Office Address
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            defaultValue={initialProfile?.address || ""}
            placeholder="e.g. 123 Charity Lane, Suite 400"
            className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none resize-none"
          ></textarea>
        </div>

        <div className="flex justify-between pt-4 border-t border-outline-variant/20">
          <Link
            href="/onboarding/step-1"
            className="border border-[#CBD5E1] text-on-surface-variant font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save & Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
