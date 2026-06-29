"use client";

import { useActionState } from "react";
import { saveStep1 } from "@/app/actions/onboarding";
import { ArrowRight } from "lucide-react";

interface ProfileData {
  org_name: string | null;
  org_type: string | null;
  reg_number: string | null;
  year_established: number | null;
  website: string | null;
}

export default function Step1Form({
  initialProfile,
}: {
  initialProfile: ProfileData | null;
}) {
  const [state, formAction, isPending] = useActionState(saveStep1, null);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Organization Details
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Tell us about your organization. This helps us verify your legitimacy.
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
            <label htmlFor="orgName" className="block text-sm font-semibold text-on-surface-variant">
              Organization Legal Name
            </label>
            <input
              id="orgName"
              name="orgName"
              type="text"
              required
              defaultValue={initialProfile?.org_name || ""}
              placeholder="e.g. Save The Children Foundation"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="orgType" className="block text-sm font-semibold text-on-surface-variant">
              Organization Type
            </label>
            <select
              id="orgType"
              name="orgType"
              required
              defaultValue={initialProfile?.org_type || "NGO"}
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface bg-white focus:border-primary focus:outline-none"
            >
              <option value="NGO">Non-Governmental Organization (NGO)</option>
              <option value="Foundation">Foundation</option>
              <option value="Trust">Trust</option>
              <option value="Charity">Registered Charity</option>
              <option value="Enterprise">Social Enterprise</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="regNumber" className="block text-sm font-semibold text-on-surface-variant">
              Registration Number / License ID
            </label>
            <input
              id="regNumber"
              name="regNumber"
              type="text"
              required
              defaultValue={initialProfile?.reg_number || ""}
              placeholder="e.g. REG-983021-A"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="yearEstablished" className="block text-sm font-semibold text-on-surface-variant">
              Year Established
            </label>
            <input
              id="yearEstablished"
              name="yearEstablished"
              type="number"
              required
              min="1800"
              max={new Date().getFullYear()}
              defaultValue={initialProfile?.year_established || ""}
              placeholder="e.g. 2012"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-on-surface-variant">
            Website (optional)
          </label>
          <input
            id="website"
            name="website"
            type="url"
            defaultValue={initialProfile?.website || ""}
            placeholder="e.g. https://www.savethechildren.org"
            className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-outline-variant/20">
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
