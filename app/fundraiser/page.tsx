import { createClient } from "@/lib/supabase/server";
import {
  TrendingUp,
  Megaphone,
  Users,
  DollarSign,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { getCurrencySymbol, convertCurrency, fetchExchangeRates } from "@/lib/utils";

interface DashboardStats {
  totalRaised: number;
  activeCampaigns: number;
  totalDonors: number;
}

interface RecentDonation {
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  created_at: string;
  campaign_title: string;
}

async function getDashboardData(userId: string): Promise<{ stats: DashboardStats; recentDonations: RecentDonation[]; fundraiserCurrency: string }> {
  const defaultStats = {
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0,
  };

  try {
    const supabase = await createClient();

    // Fetch fundraiser profile currency preference
    const { data: fundraiserProfile } = await supabase
      .from("profiles")
      .select("currency")
      .eq("id", userId)
      .single();
    const fundraiserCurrency = fundraiserProfile?.currency || "USD";

    // 1. Fetch campaigns stats
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("id, status")
      .eq("fundraiser_id", userId)
      .is("deleted_at", null);

    const activeCampaigns = campaigns?.filter(c => c.status === "active").length ?? 0;
    const campaignIds = campaigns?.map(c => c.id) || [];

    if (campaignIds.length === 0) {
      return { stats: defaultStats, recentDonations: [], fundraiserCurrency };
    }

    // Fetch real-time exchange rates
    const rates = await fetchExchangeRates();

    // 2. Fetch donations statistics
    const { data: donations } = await supabase
      .from("donations")
      .select("amount, status, donor_email, donor_name, created_at, campaigns(title, currency)")
      .in("campaign_id", campaignIds);

    const completedDonations = donations?.filter(d => d.status === "completed") || [];
    const totalRaised = completedDonations.reduce((sum, d) => {
      const amt = Number(d.amount);
      const fromCurr = (d.campaigns as any)?.currency || "USD";
      return sum + convertCurrency(amt, fromCurr, fundraiserCurrency, rates);
    }, 0);
    const uniqueDonors = new Set(donations?.map(d => d.donor_email)).size;

    const recentDonations = completedDonations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((d: any) => ({
        donor_name: d.donor_name,
        donor_email: d.donor_email,
        amount: Number(d.amount),
        currency: d.campaigns?.currency || "USD",
        created_at: d.created_at,
        campaign_title: d.campaigns?.title || "Unknown Campaign",
      }));

    return {
      stats: {
        totalRaised,
        activeCampaigns,
        totalDonors: uniqueDonors,
      },
      recentDonations,
      fundraiserCurrency,
    };
  } catch (error) {
    console.error("Failed to load dashboard statistics:", error);
    return { stats: defaultStats, recentDonations: [], fundraiserCurrency: "USD" };
  }
}

export default async function FundraiserDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { stats, recentDonations, fundraiserCurrency } = await getDashboardData(user?.id || "");

  const cards = [
    {
      title: "Funds Raised",
      value: `${getCurrencySymbol(fundraiserCurrency)}${stats.totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-primary bg-primary/10",
      description: "Total completed donations received",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns.toString(),
      icon: Megaphone,
      color: "text-slate-900 bg-slate-100",
      description: "Live fundraisers receiving donations",
    },
    {
      title: "Unique Supporters",
      value: stats.totalDonors.toString(),
      icon: Users,
      color: "text-slate-900 bg-slate-100",
      description: "Supporters who contributed to your causes",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
            Fundraiser Overview
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Track metrics and monitor donor support for your active campaigns.
          </p>
        </div>
        <Link
          href="/fundraiser/campaigns/new"
          className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium rounded-md shadow transition-colors flex items-center justify-center gap-2 cursor-pointer w-fit"
        >
          <Heart className="h-4 w-4 fill-current" />
          Create Campaign
        </Link>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg border border-slate-200/60 p-4.5 flex items-center justify-between transition-colors"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-on-surface-variant block uppercase tracking-wider">
                  {card.title}
                </span>
                <span className="text-xl font-bold text-on-surface block leading-none">
                  {card.value}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium block">
                  {card.description}
                </span>
              </div>
              <div className={`p-3 rounded-lg shrink-0 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
          <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider">
            Recent Contributions
          </h3>
          <Link
            href="/fundraiser/donations"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-on-surface-variant border-b border-slate-200/60">
                  <th className="px-5 py-2.5">Donor</th>
                  <th className="px-5 py-2.5">Campaign</th>
                  <th className="px-5 py-2.5">Amount</th>
                  <th className="px-5 py-2.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
                {recentDonations.map((d, index) => (
                  <tr key={index} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-on-surface block">{d.donor_name}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{d.donor_email}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-on-surface-variant">{d.campaign_title}</td>
                    <td className="px-5 py-3 font-bold text-primary">{getCurrencySymbol(d.currency)}{d.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-on-surface-variant text-right text-[10px] font-semibold" suppressHydrationWarning>
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-on-surface-variant space-y-2">
            <Heart className="h-8 w-8 text-slate-300 mx-auto animate-pulse" />
            <p className="font-semibold text-xs">No donations received yet.</p>
            <p className="text-[10px]">Once your campaigns receive funding, the contributions will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
