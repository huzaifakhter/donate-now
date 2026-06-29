import { Settings as SettingsIcon, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CurrencySettingsForm from "@/components/admin/CurrencySettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("currency")
    .eq("id", user?.id || "")
    .single();

  const currentCurrency = profile?.currency || "USD";

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" />
          Platform Settings
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Adjust global platform configuration parameters, fee structures, and policies.
        </p>
      </div>

      {/* Currency Preferences Form (Database-backed) */}
      <CurrencySettingsForm currentCurrency={currentCurrency} />

      {/* Form Card (Mock Parameters) */}
      <div className="bg-white rounded-lg border border-slate-200/60 p-5 space-y-5">
        <div>
          <h3 className="text-headline-sm font-semibold text-on-surface mb-1">
            General Parameters
          </h3>
          <p className="text-xs text-on-surface-variant border-b border-slate-200/60 pb-3 mb-4">
            System configuration variables for emails and notifications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant">
                Support Contact Email
              </label>
              <input
                type="email"
                defaultValue="support@donatenow.com"
                className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant">
                Alert Notification Email
              </label>
              <input
                type="email"
                defaultValue="alerts@donatenow.com"
                className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-headline-sm font-semibold text-on-surface mb-1">
            Financial & Fees
          </h3>
          <p className="text-xs text-on-surface-variant border-b border-slate-200/60 pb-3 mb-4">
            Configure transaction deductibles and payout charges.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant">
                Platform Commission Fee (%)
              </label>
              <input
                type="number"
                defaultValue="2.5"
                step="0.1"
                className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant">
                Payout Processing Fee ($)
              </label>
              <input
                type="number"
                defaultValue="0.30"
                step="0.01"
                className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-headline-sm font-semibold text-on-surface mb-1">
            Platform Restrictions
          </h3>
          <p className="text-xs text-on-surface-variant border-b border-slate-200/60 pb-3 mb-4">
            Control fundraiser onboarding requirements.
          </p>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-on-surface">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-[#CBD5E1] text-primary focus:ring-primary h-3.5 w-3.5"
              />
              Require manual verification for new fundraiser applications
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-on-surface">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-[#CBD5E1] text-primary focus:ring-primary h-3.5 w-3.5"
              />
              Enforce mandatory KYC identification proof checks
            </label>
            <label className="flex items-center gap-2.5 text-xs font-semibold text-on-surface">
              <input
                type="checkbox"
                className="rounded border-[#CBD5E1] text-primary focus:ring-primary h-3.5 w-3.5"
              />
              Allow anonymous guest donations without email check
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
          <button className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
