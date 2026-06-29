import { createClient } from "@/lib/supabase/server";
import Step5Form from "@/components/onboarding/Step5Form";

export default async function Step5Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch fundraiser profile
  const { data: profile } = await supabase
    .from("fundraiser_profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single();

  // Fetch bank details
  const { data: bank } = await supabase
    .from("bank_details")
    .select("*")
    .eq("fundraiser_id", user?.id || "")
    .single();

  // Fetch uploaded documents
  const { data: docs } = await supabase
    .from("uploaded_documents")
    .select("*")
    .eq("fundraiser_id", user?.id || "");

  const formattedDocs = (docs || []).map((d) => ({
    id: d.id,
    doc_type: d.doc_type,
    file_url: d.file_url,
    file_name: d.file_name,
  }));

  const formattedProfile = profile
    ? {
        org_name: profile.org_name,
        org_type: profile.org_type,
        reg_number: profile.reg_number,
        year_established: profile.year_established ? Number(profile.year_established) : null,
        website: profile.website,
        contact_person: profile.contact_person,
        phone: profile.phone,
        country: profile.country,
        state: profile.state,
        city: profile.city,
        address: profile.address,
      }
    : null;

  return (
    <Step5Form
      profile={formattedProfile}
      bank={bank}
      docs={formattedDocs}
      userEmail={user?.email || ""}
    />
  );
}
