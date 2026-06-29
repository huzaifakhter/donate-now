"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function verifyCampaignOwner(supabase: any, user: any, campaignId: string) {
  // Fetch profile role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    return true; // Admin has full access
  }

  // Check if owner
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("fundraiser_id")
    .eq("id", campaignId)
    .single();

  if (campaign?.fundraiser_id === user.id) {
    return true;
  }

  throw new Error("Unauthorized to access this campaign.");
}

export async function createCampaign(state: any, formData: FormData) {
  let isRequestFromAdmin = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetAmount = parseFloat(formData.get("targetAmount") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const status = (formData.get("status") as string) || "draft";

    if (!title || !description || isNaN(targetAmount) || !categoryId) {
      return { error: "Title, description, target amount, and category are required." };
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let fundraiserId = user.id;

    if (profile?.role === "admin") {
      isRequestFromAdmin = true;
      // Admin can create a campaign on behalf of another fundraiser if specified
      const selectedFundraiser = formData.get("fundraiserId") as string;
      if (selectedFundraiser) {
        fundraiserId = selectedFundraiser;
      }
    } else if (profile?.role !== "fundraiser") {
      throw new Error("Only fundraiser accounts can create campaigns.");
    }

    // If fundraiser, check onboarding / verification status
    if (profile?.role === "fundraiser") {
      const { data: fundProfile } = await supabase
        .from("fundraiser_profiles")
        .select("verification_status")
        .eq("id", user.id)
        .single();
      
      if (fundProfile?.verification_status !== "approved") {
        throw new Error("Your account must be approved before publishing campaigns.");
      }
    }

    const currency = (formData.get("currency") as string) || "USD";

    const { error } = await supabase
      .from("campaigns")
      .insert({
        title,
        description,
        target_amount: targetAmount,
        category_id: categoryId || null,
        fundraiser_id: fundraiserId,
        status,
        currency,
        image_url: imageUrl || null
      });

    if (error) {
      return { error: "Failed to create campaign: " + error.message };
    }

    revalidatePath("/fundraiser/campaigns");
    revalidatePath("/admin/campaigns");
  } catch (err: any) {
    return { error: err.message };
  }

  if (isRequestFromAdmin) {
    redirect("/admin/campaigns");
  } else {
    redirect("/fundraiser/campaigns");
  }
}

export async function updateCampaign(state: any, formData: FormData) {
  let isRequestFromAdmin = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized");

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetAmount = parseFloat(formData.get("targetAmount") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const status = formData.get("status") as string;

    if (!id || !title || !description || isNaN(targetAmount) || !categoryId || !status) {
      return { error: "All campaign fields are required." };
    }

    await verifyCampaignOwner(supabase, user, id);

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      isRequestFromAdmin = true;
    }

    const currency = (formData.get("currency") as string) || "USD";

    const { error } = await supabase
      .from("campaigns")
      .update({
        title,
        description,
        target_amount: targetAmount,
        category_id: categoryId || null,
        status,
        currency,
        image_url: imageUrl || null
      })
      .eq("id", id);

    if (error) {
      return { error: "Failed to update campaign: " + error.message };
    }

    revalidatePath("/fundraiser/campaigns");
    revalidatePath("/admin/campaigns");
  } catch (err: any) {
    return { error: err.message };
  }

  if (isRequestFromAdmin) {
    redirect("/admin/campaigns");
  } else {
    redirect("/fundraiser/campaigns");
  }
}

export async function toggleCampaignStatus(campaignId: string, currentStatus: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await verifyCampaignOwner(supabase, user, campaignId);

    const nextStatus = currentStatus === "active" ? "paused" : "active";

    const { error } = await supabase
      .from("campaigns")
      .update({ status: nextStatus })
      .eq("id", campaignId);

    if (error) {
      return { error: "Failed to update status: " + error.message };
    }

    revalidatePath("/fundraiser/campaigns");
    revalidatePath("/admin/campaigns");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await verifyCampaignOwner(supabase, user, campaignId);

    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from("campaigns")
      .update({ deleted_at: new Date().toISOString(), status: "paused" })
      .eq("id", campaignId);

    if (error) {
      return { error: "Failed to delete campaign: " + error.message };
    }

    revalidatePath("/fundraiser/campaigns");
    revalidatePath("/admin/campaigns");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
