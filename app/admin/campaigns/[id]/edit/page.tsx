import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FundraiserCampaignForm from "@/components/fundraiser/CampaignForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCampaignPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, description, target_amount, category_id, status, image_url, fundraiser_id")
    .eq("id", id)
    .single();

  if (!campaign) {
    redirect("/admin/campaigns");
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  // Fetch fundraisers list so admin can change owner if necessary
  const { data: fundraisers } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      fundraiser_profiles (
        org_name
      )
    `)
    .eq("role", "fundraiser");

  const formattedFundraisers = (fundraisers || []).map((f: any) => ({
    id: f.id,
    email: f.email,
    org_name: f.fundraiser_profiles?.[0]?.org_name || f.email,
  }));

  const formattedCampaign = {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    target_amount: Number(campaign.target_amount),
    category_id: campaign.category_id,
    status: campaign.status,
    image_url: campaign.image_url,
  };

  return (
    <FundraiserCampaignForm
      categories={categories || []}
      initialData={formattedCampaign}
      isAdmin={true}
      fundraisers={formattedFundraisers}
    />
  );
}
