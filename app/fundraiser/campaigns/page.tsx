import { createClient } from "@/lib/supabase/server";
import FundraiserCampaignList from "@/components/onboarding/../../components/fundraiser/CampaignList";

export default async function FundraiserCampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, title, description, target_amount, raised_amount, status, currency, image_url, categories(name)")
    .eq("fundraiser_id", user?.id || "")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const formattedCampaigns = (campaigns || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    target_amount: Number(c.target_amount),
    raised_amount: Number(c.raised_amount),
    status: c.status,
    currency: c.currency || "USD",
    image_url: c.image_url,
    category_name: c.categories?.name || "Uncategorized",
  }));

  return <FundraiserCampaignList initialCampaigns={formattedCampaigns} />;
}
