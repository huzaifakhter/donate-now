import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/admin/SearchInput";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Ban, ArrowUpRight, HelpCircle, FileText } from "lucide-react";

interface FundraiserProfile {
  id: string;
  email: string;
  full_name: string;
  org_name: string | null;
  created_at: string;
  verification_status: string;
  is_submitted: boolean;
  campaign_count: number;
}

async function getFundraisers(search?: string, statusFilter?: string): Promise<FundraiserProfile[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        created_at,
        fundraiser_profiles(
          org_name,
          verification_status,
          is_submitted
        )
      `)
      .eq("role", "fundraiser");

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data: profiles, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    const formatted = await Promise.all(
      (profiles || []).map(async (p: any) => {
        // Fetch campaign count
        const { count } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("fundraiser_id", p.id)
          .is("deleted_at", null);

        // fundraiser_profiles could be returned as a single object or an array depending on join specs
        const fundProf = Array.isArray(p.fundraiser_profiles) 
          ? p.fundraiser_profiles[0] 
          : p.fundraiser_profiles || null;

        return {
          id: p.id,
          email: p.email,
          full_name: p.full_name,
          org_name: fundProf?.org_name || null,
          created_at: p.created_at,
          verification_status: fundProf?.verification_status || "pending",
          is_submitted: fundProf?.is_submitted || false,
          campaign_count: count ?? 0,
        };
      })
    );

    // Apply status filter
    if (statusFilter) {
      if (statusFilter === "pending") {
        return formatted.filter(f => f.verification_status === "pending" || f.verification_status === "under_review");
      }
      if (statusFilter === "suspended") {
        return formatted.filter(f => f.verification_status === "blocked_temp" || f.verification_status === "blocked_perm");
      }
      return formatted.filter(f => f.verification_status === statusFilter);
    }

    return formatted;
  } catch (error) {
    console.error("Profiles database query failed:", error);
    return [];
  }
}

export default async function FundraisersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  const status = params.status;

  const fundraisers = await getFundraisers(search, status);

  const getStatusBadge = (status: string, isSubmitted: boolean) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
            <AlertCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case "blocked_temp":
      case "blocked_perm":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 border border-red-100">
            <Ban className="h-3 w-3" />
            {status === "blocked_temp" ? "Suspended (Temp)" : "Suspended (Perm)"}
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white border border-slate-950">
            <AlertCircle className="h-3 w-3" />
            Under Review
          </span>
        );
      default:
        if (isSubmitted) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200">
              <AlertCircle className="h-3 w-3" />
              Pending Review
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200/60">
            <HelpCircle className="h-3 w-3" />
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Fundraiser Accounts
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Review onboarding documentation, check verification status, and manage partner permissions.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchInput placeholder="Search fundraisers..." />
        
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          <Link
            href="/admin/fundraisers"
            className={`px-3 py-1.5 rounded-md border ${
              !status
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Statuses
          </Link>
          <Link
            href="/admin/fundraisers?status=pending"
            className={`px-3 py-1.5 rounded-md border ${
              status === "pending"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/fundraisers?status=approved"
            className={`px-3 py-1.5 rounded-md border ${
              status === "approved"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Approved
          </Link>
          <Link
            href="/admin/fundraisers?status=rejected"
            className={`px-3 py-1.5 rounded-md border ${
              status === "rejected"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Rejected
          </Link>
          <Link
            href="/admin/fundraisers?status=suspended"
            className={`px-3 py-1.5 rounded-md border ${
              status === "suspended"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Suspended
          </Link>
        </div>
      </div>

      {/* Table listing */}
      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-on-surface-variant border-b border-slate-200/60">
                <th className="px-5 py-2.5">Partner Name / Org</th>
                <th className="px-5 py-2.5">Email Address</th>
                <th className="px-5 py-2.5 text-center">Campaigns</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5">Registered</th>
                <th className="px-5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
              {fundraisers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant font-medium">
                    No fundraisers found.
                  </td>
                </tr>
              ) : (
                fundraisers.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3">
                      <span className="font-bold text-on-surface block leading-tight">{f.full_name || "N/A"}</span>
                      {f.org_name && (
                        <span className="text-[10px] text-primary font-semibold mt-0.5 block">{f.org_name}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-on-surface-variant">{f.email}</td>
                    <td className="px-5 py-3 text-center font-bold text-primary">{f.campaign_count}</td>
                    <td className="px-5 py-3">
                      {getStatusBadge(f.verification_status, f.is_submitted)}
                    </td>
                    <td className="px-5 py-3 text-[10px] text-on-surface-variant font-semibold" suppressHydrationWarning>
                      {new Date(f.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {f.is_submitted || f.verification_status !== "pending" ? (
                        <Link
                          href={`/admin/fundraisers/${f.id}`}
                          className="h-8 px-3 rounded-md text-xs font-medium bg-primary text-white shadow hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Review Details
                        </Link>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant font-medium italic">Incomplete Onboarding</span>
                      )}
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
