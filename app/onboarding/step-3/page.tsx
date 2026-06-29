import { createClient } from "@/lib/supabase/server";
import DocumentUploadWizard from "@/components/onboarding/DocumentUploadWizard";

export default async function Step3Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch already uploaded documents
  const { data: docs } = await supabase
    .from("uploaded_documents")
    .select("id, doc_type, file_url, file_name")
    .eq("fundraiser_id", user?.id || "");

  const formattedDocs = (docs || []).map((d) => ({
    id: d.id,
    doc_type: d.doc_type,
    file_url: d.file_url,
    file_name: d.file_name,
  }));

  return <DocumentUploadWizard initialDocs={formattedDocs} />;
}
