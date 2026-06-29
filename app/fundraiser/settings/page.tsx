import { createClient } from "@/lib/supabase/server";
import { Building2, User, Landmark, ShieldCheck } from "lucide-react";
import CurrencySettingsForm from "@/components/admin/CurrencySettingsForm";

export default async function FundraiserSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch fundraiser profile
  const { data: profile } = await supabase
    .from("fundraiser_profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single();

  // Fetch basic user profile
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name, email, currency")
    .eq("id", user?.id || "")
    .single();

  // Fetch bank details
  const { data: bank } = await supabase
    .from("bank_details")
    .select("*")
    .eq("fundraiser_id", user?.id || "")
    .single();

  const currentCurrency = userProfile?.currency || "USD";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Portal Settings & Profile
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          View your verified partner details and banking configurations.
        </p>
      </div>

      {/* Currency Preferences Form (Database-backed) */}
      <div className="max-w-2xl">
        <CurrencySettingsForm currentCurrency={currentCurrency} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Org Details */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-5 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">Organization Profile</h2>
              <p className="text-[10px] text-on-surface-variant font-medium">Verified business registrations</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Org Legal Name</span>
              <span className="font-bold text-on-surface">{profile?.org_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Org Type</span>
              <span className="font-bold text-on-surface">{profile?.org_type || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Reg Number</span>
              <span className="font-bold text-on-surface">{profile?.reg_number || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Year Established</span>
              <span className="font-bold text-on-surface">{profile?.year_established || "N/A"}</span>
            </div>
            {profile?.website && (
              <div className="col-span-2">
                <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Website</span>
                <span className="font-semibold text-primary">{profile.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Bank Account */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-5 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
            <Landmark className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">Payout Settings</h2>
              <p className="text-[10px] text-on-surface-variant font-medium">Settlement bank accounts</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Account Holder</span>
              <span className="font-bold text-on-surface">{bank?.account_holder_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Bank Name</span>
              <span className="font-bold text-on-surface">{bank?.bank_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Account Number</span>
              <span className="font-bold text-on-surface">••••{bank?.account_number ? bank.account_number.slice(-4) : "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">IFSC / SWIFT</span>
              <span className="font-bold text-on-surface">{bank?.ifsc_swift || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Branch Location</span>
              <span className="font-bold text-on-surface">{bank?.branch || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Contact Person Card */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-5 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">Contact Representative</h2>
              <p className="text-[10px] text-on-surface-variant font-medium">Primary manager details</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Representative</span>
              <span className="font-bold text-on-surface">{profile?.contact_person || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Phone</span>
              <span className="font-bold text-on-surface">{profile?.phone || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Email Address</span>
              <span className="font-bold text-on-surface">{userProfile?.email || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider mb-0.5">Location</span>
              <span className="font-bold text-on-surface">{profile?.city ? `${profile.city}, ${profile.country}` : "N/A"}</span>
            </div>
          </div>
        </div>

        {/* System Credentials Card */}
        <div className="bg-white border border-slate-200/60 rounded-lg p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">Platform Compliance</h2>
                <p className="text-[10px] text-on-surface-variant font-medium">Security and status certificates</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-100 p-2.5 rounded-md text-emerald-800 font-semibold">
                <span>Verification Status:</span>
                <span className="uppercase font-bold tracking-wider">{profile?.verification_status || "Approved"}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Your organization has successfully completed the KYC verification onboarding steps. Your campaigns are eligible to receive public charitable donations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
