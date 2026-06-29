import { createClient } from "@/lib/supabase/server";
import Step1Form from "@/components/onboarding/Step1Form";

export default async function Step1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch existing details
  const { data: profile } = await supabase
    .from("fundraiser_profiles")
    .select("org_name, org_type, reg_number, year_established, website")
    .eq("id", user?.id || "")
    .single();

  const formattedProfile = profile
    ? {
        org_name: profile.org_name,
        org_type: profile.org_type,
        reg_number: profile.reg_number,
        year_established: profile.year_established ? Number(profile.year_established) : null,
        website: profile.website,
      }
    : null;

  return <Step1Form initialProfile={formattedProfile} />;
}
