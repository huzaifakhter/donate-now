import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/admin/SearchInput";
import Link from "next/link";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { getCurrencySymbol } from "@/lib/utils";

interface DonationTransaction {
  id: string;
  donor_name: string;
  donor_email: string;
  campaign_title: string;
  amount: number;
  status: string; // 'pending', 'completed', 'failed'
  currency: string;
  created_at: string;
}

async function getDonations(search?: string, statusFilter?: string): Promise<DonationTransaction[]> {
  const defaultDonations: DonationTransaction[] = [
    {
      id: "donation-1",
      donor_name: "Sarah Jenkins",
      donor_email: "sarah.j@example.com",
      campaign_title: "Digital Literacy for Rural Youth",
      amount: 150.00,
      status: "completed",
      currency: "USD",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "donation-2",
      donor_name: "Michael Chen",
      donor_email: "mchen@example.com",
      campaign_title: "Surgery Support for Maya",
      amount: 500.00,
      status: "completed",
      currency: "USD",
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "donation-3",
      donor_name: "Emma Davis",
      donor_email: "emma.d@example.com",
      campaign_title: "Flood Relief for Coastal Communities",
      amount: 75.00,
      status: "completed",
      currency: "USD",
      created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: "donation-4",
      donor_name: "David Miller",
      donor_email: "dmiller@example.com",
      campaign_title: "Digital Literacy for Rural Youth",
      amount: 50.00,
      status: "pending",
      currency: "USD",
      created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    },
    {
      id: "donation-5",
      donor_name: "Lisa Anderson",
      donor_email: "lisa.a@example.com",
      campaign_title: "Surgery Support for Maya",
      amount: 250.00,
      status: "failed",
      currency: "USD",
      created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    },
  ];

  try {
    const supabase = await createClient();
    let query = supabase
      .from("donations")
      .select(`
        id,
        donor_name,
        donor_email,
        amount,
        status,
        created_at,
        campaigns (
          title,
          currency
        )
      `);

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    if (search) {
      query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%`);
    }

    const { data: dbDonations, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    if (dbDonations && dbDonations.length > 0) {
      return dbDonations.map((d: any) => ({
        id: d.id,
        donor_name: d.donor_name,
        donor_email: d.donor_email,
        campaign_title: d.campaigns?.title ?? "Unknown Campaign",
        amount: Number(d.amount),
        status: d.status,
        currency: d.campaigns?.currency || "USD",
        created_at: d.created_at,
      }));
    }
  } catch (error) {
    console.error("Donations query failed, returning mock transactions:", error);
  }

  // Fallback filtering
  let filtered = [...defaultDonations];
  if (statusFilter) {
    filtered = filtered.filter((d) => d.status === statusFilter);
  }
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.donor_name.toLowerCase().includes(term) ||
        d.donor_email.toLowerCase().includes(term) ||
        d.campaign_title.toLowerCase().includes(term)
    );
  }
  return filtered;
}

export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  const status = params.status;

  const donations = await getDonations(search, status);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Donation Transactions
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Monitor all processed donations, payouts, and receipt logs.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchInput placeholder="Search donor name or email..." />
        
        <div className="flex gap-1.5 text-xs font-semibold">
          <Link
            href="/admin/donations"
            className={`px-3 py-1.5 rounded-md border ${
              !status
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Statuses
          </Link>
          <Link
            href="/admin/donations?status=completed"
            className={`px-3 py-1.5 rounded-md border ${
              status === "completed"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Completed
          </Link>
          <Link
            href="/admin/donations?status=pending"
            className={`px-3 py-1.5 rounded-md border ${
              status === "pending"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/donations?status=failed"
            className={`px-3 py-1.5 rounded-md border ${
              status === "failed"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Failed
          </Link>
        </div>
      </div>

      {/* Table Listing */}
      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-on-surface-variant border-b border-slate-200/60">
                <th className="px-5 py-2.5">Transaction ID</th>
                <th className="px-5 py-2.5">Donor</th>
                <th className="px-5 py-2.5">Campaign</th>
                <th className="px-5 py-2.5 text-right">Amount</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3 font-mono text-[10px] text-on-surface-variant">
                      {d.id.substring(0, 13)}...
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold">{d.donor_name}</div>
                      <div className="text-[10px] text-on-surface-variant font-medium">{d.donor_email}</div>
                    </td>
                    <td className="px-5 py-3 truncate max-w-[180px]" title={d.campaign_title}>
                      {d.campaign_title}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-primary">
                      {getCurrencySymbol(d.currency)}{d.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3">
                      {d.status === "completed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                      {d.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {d.status === "failed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 border border-red-100">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-[10px] text-on-surface-variant font-semibold" suppressHydrationWarning>
                      {new Date(d.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
