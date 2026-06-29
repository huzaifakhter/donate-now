"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Utility to verify authenticated fundraiser
async function getAuthFundraiser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "fundraiser") {
    throw new Error("Forbidden");
  }

  // Create admin client for bypassing RLS writes
  const adminClient = await createAdminClient();

  return { user, supabase: adminClient };
}

// STEP 1 - Save Organization Details
export async function saveStep1(state: any, formData: FormData) {
  try {
    const { user, supabase } = await getAuthFundraiser();

    const orgName = formData.get("orgName") as string;
    const orgType = formData.get("orgType") as string;
    const regNumber = formData.get("regNumber") as string;
    const yearEstablished = parseInt(formData.get("yearEstablished") as string, 10);
    const website = formData.get("website") as string;

    if (!orgName || !orgType || !regNumber || isNaN(yearEstablished)) {
      return { error: "Organization Name, Type, Reg Number, and Year Established are required." };
    }

    const { error } = await supabase
      .from("fundraiser_profiles")
      .upsert({
        id: user.id,
        org_name: orgName,
        org_type: orgType,
        reg_number: regNumber,
        year_established: yearEstablished,
        website: website || null,
        onboarding_step: 2,
        is_submitted: false,
        verification_status: "pending"
      });

    if (error) {
      return { error: "Failed to save organization info: " + error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/onboarding/step-2");
}

// STEP 2 - Save Contact Details
export async function saveStep2(state: any, formData: FormData) {
  try {
    const { user, supabase } = await getAuthFundraiser();

    const contactPerson = formData.get("contactPerson") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const stateVal = formData.get("state") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;

    if (!contactPerson || !phone || !country || !stateVal || !city || !address) {
      return { error: "All contact fields are required." };
    }

    const { error } = await supabase
      .from("fundraiser_profiles")
      .update({
        contact_person: contactPerson,
        phone: phone,
        country: country,
        state: stateVal,
        city: city,
        address: address,
        onboarding_step: 3
      })
      .eq("id", user.id);

    if (error) {
      return { error: "Failed to save contact info: " + error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/onboarding/step-3");
}

// STEP 3 - Upload Documents
export async function uploadDocument(formData: FormData) {
  try {
    const { user, supabase } = await getAuthFundraiser();

    const file = formData.get("file") as File;
    const docType = formData.get("docType") as string;

    if (!file || !docType) {
      return { error: "File and Document Type are required." };
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size exceeds 5MB limit." };
    }

    // Validate mime types
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Only PDF, PNG, JPG, and JPEG formats are allowed." };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${docType}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Convert file to arraybuffer for upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to fundraiser-documents bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fundraiser-documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      return { error: "Failed to upload file to storage: " + uploadError.message };
    }

    // Get public/signed URL
    const { data: urlData } = await supabase.storage
      .from("fundraiser-documents")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Insert metadata into uploaded_documents table
    const { error: dbError } = await supabase
      .from("uploaded_documents")
      .insert({
        fundraiser_id: user.id,
        doc_type: docType,
        file_url: fileUrl,
        file_name: file.name
      });

    if (dbError) {
      return { error: "Failed to save document metadata: " + dbError.message };
    }

    return { success: true, fileUrl, fileName: file.name, docType };
  } catch (err: any) {
    return { error: err.message };
  }
}

// Delete Document
export async function deleteDocument(docId: string, fileUrl: string) {
  try {
    const { user, supabase } = await getAuthFundraiser();

    // 1. Delete from database
    const { error: dbError } = await supabase
      .from("uploaded_documents")
      .delete()
      .eq("id", docId)
      .eq("fundraiser_id", user.id);

    if (dbError) {
      return { error: "Failed to delete document metadata: " + dbError.message };
    }

    // 2. Delete from storage (Extract file path from publicUrl)
    const filePath = fileUrl.split("/fundraiser-documents/").pop();
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("fundraiser-documents")
        .remove([decodeURIComponent(filePath)]);
      
      if (storageError) {
        console.error("Storage cleanup failed:", storageError.message);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// Save Step 3 progress
export async function saveStep3() {
  try {
    const { user, supabase } = await getAuthFundraiser();

    // Verify registration certificate is uploaded
    const { data: docs } = await supabase
      .from("uploaded_documents")
      .select("doc_type")
      .eq("fundraiser_id", user.id);

    const hasRegCert = docs?.some(d => d.doc_type === "reg_certificate");
    const hasTaxReg = docs?.some(d => d.doc_type === "tax_reg");
    const hasIdProof = docs?.some(d => d.doc_type === "id_proof");

    if (!hasRegCert || !hasTaxReg || !hasIdProof) {
      return { error: "Please upload the required documents: Government Registration, Tax Registration, and Identity Proof." };
    }

    const { error } = await supabase
      .from("fundraiser_profiles")
      .update({ onboarding_step: 4 })
      .eq("id", user.id);

    if (error) {
      return { error: "Failed to update onboarding progress: " + error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/onboarding/step-4");
}

// STEP 4 - Save Banking Details
export async function saveStep4(state: any, formData: FormData) {
  try {
    const { user, supabase } = await getAuthFundraiser();

    const accountHolderName = formData.get("accountHolderName") as string;
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const ifscSwift = formData.get("ifscSwift") as string;
    const branch = formData.get("branch") as string;
    const chequeFileUrl = formData.get("chequeFileUrl") as string;

    if (!accountHolderName || !bankName || !accountNumber || !ifscSwift || !branch) {
      return { error: "All banking fields are required." };
    }

    // Save/update bank details
    const { error: bankError } = await supabase
      .from("bank_details")
      .upsert({
        fundraiser_id: user.id,
        account_holder_name: accountHolderName,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_swift: ifscSwift,
        branch: branch,
        cheque_file_url: chequeFileUrl || null
      });

    if (bankError) {
      return { error: "Failed to save banking details: " + bankError.message };
    }

    // Update step progress
    const { error: profileError } = await supabase
      .from("fundraiser_profiles")
      .update({ onboarding_step: 5 })
      .eq("id", user.id);

    if (profileError) {
      return { error: "Failed to update onboarding progress: " + profileError.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/onboarding/step-5");
}

// STEP 5 - Submit Review and Verification Request
export async function submitOnboarding() {
  try {
    const { user, supabase } = await getAuthFundraiser();

    // Set is_submitted and pending status
    const { error } = await supabase
      .from("fundraiser_profiles")
      .update({
        is_submitted: true,
        verification_status: "pending",
        onboarding_step: 5
      })
      .eq("id", user.id);

    if (error) {
      return { error: "Submission failed: " + error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/onboarding/pending");
}

export async function resubmitOnboarding() {
  try {
    const { user, supabase } = await getAuthFundraiser();

    const { error } = await supabase
      .from("fundraiser_profiles")
      .update({
        is_submitted: false,
        onboarding_step: 1
      })
      .eq("id", user.id);

    if (error) {
      return { error: "Failed to unlock onboarding: " + error.message };
    }
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/onboarding/step-1");
}
