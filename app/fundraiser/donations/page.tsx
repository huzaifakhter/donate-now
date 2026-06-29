import { createClient } from "@/lib/supabase/server";
import { Heart, HeartHandshake } from "lucide-react";
import { getCurrencySymbol } from "@/lib/utils";

async function getDonations(userId: string) {
  try {
    const supabase = await createClient();

    const { data: donations, error } = await supabase
      .from("donations")
      .select("id, amount, donor_name, donor_email, created_at, campaigns!inner(title, fundraiser_id, currency)")
      .eq("campaigns.fundraiser_id", userId)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Donation query failed:", error.message);
      return [];
    }

    return (donations || []).map((d: any) => ({
      id: d.id,
      amount: Number(d.amount),
      donor_name: d.donor_name,
      donor_email: d.donor_email,
      created_at: d.created_at,
      campaign_title: d.campaigns?.title || "Unknown Campaign",
      currency: d.campaigns?.currency || "USD",
    }));
  } catch (err) {
    console.error("Error loading donations:", err);
    return [];
  }
}

export default async function FundraiserDonationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const donations = await getDonations(user?.id || "");
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
            Donation Log
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Monitor all financial contributions received for your campaigns.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200/60 px-4 py-2 flex items-center gap-3 w-fit shrink-0">
          <HeartHandshake className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Cumulative Payouts
            </span>
            <span className="font-bold text-base text-primary leading-none">
              ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Grid table */}
      <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
        {donations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-on-surface-variant border-b border-slate-200/60">
                  <th className="px-5 py-2.5">Donor</th>
                  <th className="px-5 py-2.5">Campaign</th>
                  <th className="px-5 py-2.5">Contribution</th>
                  <th className="px-5 py-2.5 text-right">Date Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-on-surface block">{d.donor_name}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{d.donor_email}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-on-surface-variant">{d.campaign_title}</td>
                    <td className="px-5 py-3 font-bold text-primary">{getCurrencySymbol(d.currency)}{d.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-on-surface-variant text-right text-[10px] font-semibold" suppressHydrationWarning>
                      {new Date(d.created_at).toLocaleDateString()} {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-on-surface-variant space-y-4">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="h-8 w-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-xs text-on-surface">No Transactions Recorded</h3>
              <p className="text-[10px] text-on-surface-variant max-w-sm mx-auto">
                No financial donations have been made to your campaigns yet. When donors contribute, the records will display here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
