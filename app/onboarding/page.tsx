import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current step
  const { data: fundProfile } = await supabase
    .from("fundraiser_profiles")
    .select("onboarding_step, is_submitted, verification_status")
    .eq("id", user.id)
    .single();

  if (fundProfile) {
    if (fundProfile.is_submitted) {
      if (fundProfile.verification_status === "rejected") {
        redirect("/onboarding/rejected");
      }
      redirect("/onboarding/pending");
    }

    const step = fundProfile.onboarding_step;
    redirect(`/onboarding/step-${step}`);
  }

  // Fallback to step 1
  redirect("/onboarding/step-1");
}
