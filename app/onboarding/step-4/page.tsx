import { createClient } from "@/lib/supabase/server";
import BankingInformationForm from "@/components/onboarding/BankingInformationForm";

export default async function Step4Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch bank details
  const { data: bankDetails } = await supabase
    .from("bank_details")
    .select("account_holder_name, bank_name, account_number, ifsc_swift, branch, cheque_file_url")
    .eq("fundraiser_id", user?.id || "")
    .single();

  // Fetch document name for bank_proof if uploaded
  let chequeName = "";
  if (bankDetails?.cheque_file_url) {
    const { data: doc } = await supabase
      .from("uploaded_documents")
      .select("file_name")
      .eq("fundraiser_id", user?.id || "")
      .eq("doc_type", "bank_proof")
      .single();
    
    if (doc) {
      chequeName = doc.file_name;
    }
  }

  return (
    <BankingInformationForm
      initialDetails={bankDetails}
      initialChequeName={chequeName}
    />
  );
}
