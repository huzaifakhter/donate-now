import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/admin/SearchInput";
import Link from "next/link";
import AdminCampaignList from "@/components/admin/AdminCampaignList";

interface CampaignItem {
  id: string;
  title: string;
  target_amount: number;
  raised_amount: number;
  status: string;
  currency: string;
  category_name: string;
  fundraiser_name: string;
  created_at: string;
}

async function getCampaigns(search?: string, statusFilter?: string): Promise<CampaignItem[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("campaigns")
      .select(`
        id,
        title,
        target_amount,
        raised_amount,
        status,
        currency,
        created_at,
        categories (
          name
        ),
        profiles (
          full_name
        )
      `)
      .is("deleted_at", null);

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data: dbCampaigns, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    return (dbCampaigns || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      target_amount: Number(c.target_amount),
      raised_amount: Number(c.raised_amount),
      status: c.status,
      currency: c.currency || "USD",
      category_name: c.categories?.name ?? "General",
      fundraiser_name: c.profiles?.full_name ?? "Unknown",
      created_at: c.created_at,
    }));
  } catch (error) {
    console.error("Campaigns query failed:", error);
    return [];
  }
}

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  const status = params.status;

  const campaigns = await getCampaigns(search, status);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Campaign Management
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Review, approve, pause, or remove crowdfunding campaigns.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-slate-200/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchInput placeholder="Search campaigns by title..." />
        
        <div className="flex gap-1.5 text-xs font-semibold">
          <Link
            href="/admin/campaigns"
            className={`px-3 py-1.5 rounded-md border ${
              !status
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Statuses
          </Link>
          <Link
            href="/admin/campaigns?status=active"
            className={`px-3 py-1.5 rounded-md border ${
              status === "active"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </Link>
          <Link
            href="/admin/campaigns?status=paused"
            className={`px-3 py-1.5 rounded-md border ${
              status === "paused"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Paused
          </Link>
          <Link
            href="/admin/campaigns?status=draft"
            className={`px-3 py-1.5 rounded-md border ${
              status === "draft"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Draft
          </Link>
        </div>
      </div>

      {/* Campaigns Listing */}
      <AdminCampaignList initialCampaigns={campaigns} />
    </div>
  );
}
