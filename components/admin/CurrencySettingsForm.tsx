"use client";

import { useActionState } from "react";
import { updateUserCurrency } from "@/app/actions/profiles";
import { CURRENCIES } from "@/lib/utils";
import { Save, CheckCircle2 } from "lucide-react";

export default function CurrencySettingsForm({ currentCurrency }: { currentCurrency: string }) {
  const [state, formAction, isPending] = useActionState(updateUserCurrency, null);

  return (
    <form action={formAction} className="bg-white rounded-lg border border-slate-200/60 p-5 space-y-5 shadow-sm">
      <div>
        <h3 className="text-headline-sm font-semibold text-on-surface mb-1">
          Currency Preference
        </h3>
        <p className="text-xs text-on-surface-variant border-b border-slate-200/60 pb-3 mb-4">
          Configure your preferred display currency for dashboard metrics and analytics.
        </p>

        {state?.success && (
          <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Currency preferences updated successfully!</span>
          </div>
        )}

        {state?.error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800">
            {state.error}
          </div>
        )}

        <div className="max-w-xs">
          <label htmlFor="currency" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
            Display Currency
          </label>
          <select
            id="currency"
            name="currency"
            required
            defaultValue={currentCurrency || "USD"}
            className="block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface bg-white focus:border-primary focus:outline-none"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
        <button
          type="submit"
          disabled={isPending}
          className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );
}
