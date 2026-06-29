import { createClient } from "@/lib/supabase/server";
import Step2Form from "@/components/onboarding/Step2Form";

export default async function Step2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch existing details
  const { data: profile } = await supabase
    .from("fundraiser_profiles")
    .select("contact_person, phone, country, state, city, address")
    .eq("id", user?.id || "")
    .single();

  return <Step2Form initialProfile={profile} />;
}
