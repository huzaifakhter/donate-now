import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FundraiserCampaignForm from "@/components/fundraiser/CampaignForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampaignPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch campaign details
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, description, target_amount, category_id, status, currency, image_url, fundraiser_id")
    .eq("id", id)
    .single();

  if (!campaign) {
    redirect("/fundraiser/campaigns");
  }

  // Verify owner permission (ensure only owner or admin can edit)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id || "")
    .single();

  if (profile?.role !== "admin" && campaign.fundraiser_id !== user?.id) {
    redirect("/fundraiser/campaigns");
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  const formattedCampaign = {
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    target_amount: Number(campaign.target_amount),
    category_id: campaign.category_id,
    status: campaign.status,
    currency: campaign.currency || "USD",
    image_url: campaign.image_url,
  };

  return (
    <FundraiserCampaignForm
      categories={categories || []}
      initialData={formattedCampaign}
    />
  );
}
