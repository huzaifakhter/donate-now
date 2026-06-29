"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function donateToCampaign(state: any, formData: FormData) {
  try {
    const supabase = await createAdminClient();

    const campaignId = formData.get("campaignId") as string;
    const donorName = formData.get("donorName") as string;
    const donorEmail = formData.get("donorEmail") as string;
    const amount = parseFloat(formData.get("amount") as string);

    if (!campaignId || !donorName || !donorEmail || isNaN(amount) || amount <= 0) {
      return { error: "All donation fields are required, and amount must be positive." };
    }

    // 1. Fetch current campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("status, raised_amount, title")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      return { error: "Campaign not found." };
    }

    if (campaign.status !== "active") {
      return { error: "This campaign is currently not accepting active donations." };
    }

    // 2. Insert Completed Donation record
    const { error: donationError } = await supabase
      .from("donations")
      .insert({
        campaign_id: campaignId,
        amount,
        donor_name: donorName,
        donor_email: donorEmail,
        status: "completed",
      });

    if (donationError) {
      return { error: "Failed to record donation transaction: " + donationError.message };
    }

    // 3. Update campaign raised amount
    const newRaised = Number(campaign.raised_amount) + amount;
    const { error: updateError } = await supabase
      .from("campaigns")
      .update({ raised_amount: newRaised })
      .eq("id", campaignId);

    if (updateError) {
      console.error("Failed to increment campaign raised amount:", updateError.message);
    }

    // 4. Revalidate all cached panels
    revalidatePath(`/campaigns/${campaignId}`);
    revalidatePath("/fundraiser");
    revalidatePath("/fundraiser/donations");
    revalidatePath("/fundraiser/campaigns");
    revalidatePath("/admin");
    revalidatePath("/admin/donations");
    revalidatePath("/admin/campaigns");

    return { success: true, campaignTitle: campaign.title, donationAmount: amount };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
