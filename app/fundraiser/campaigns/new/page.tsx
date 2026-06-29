import { createClient } from "@/lib/supabase/server";
import FundraiserCampaignForm from "@/components/fundraiser/CampaignForm";

export default async function NewCampaignPage() {
  const supabase = await createClient();

  // Fetch categories options
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return <FundraiserCampaignForm categories={categories || []} />;
}
