import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FundraiserLayout from "@/components/fundraiser/FundraiserLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profiles details
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  // Fetch organization name
  const { data: fundProfile } = await supabase
    .from("fundraiser_profiles")
    .select("org_name")
    .eq("id", user.id)
    .single();

  return (
    <FundraiserLayout
      email={user.email || ""}
      fullName={profile?.full_name || ""}
      orgName={fundProfile?.org_name || ""}
    >
      {children}
    </FundraiserLayout>
  );
}
