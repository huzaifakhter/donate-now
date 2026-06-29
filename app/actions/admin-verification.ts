"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: Access restricted to administrators.");
  }

  return { adminUser: user, supabase };
}

export async function verifyFundraiserAction(state: any, formData: FormData) {
  try {
    const { adminUser, supabase } = await verifyAdmin();

    const id = formData.get("id") as string;
    const action = formData.get("action") as string;
    const rejectionReason = formData.get("rejectionReason") as string;
    const blockReason = formData.get("blockReason") as string;

    if (!id || !action) {
      return { error: "Fundraiser ID and action are required." };
    }

    let nextStatus = "pending";
    let clearRejection = true;

    if (action === "approve") {
      nextStatus = "approved";
    } else if (action === "reject") {
      if (!rejectionReason) {
        return { error: "Please enter a reason for rejecting the application." };
      }
      nextStatus = "rejected";
      clearRejection = false;
    } else if (action === "block_temp") {
      if (!blockReason) {
        return { error: "Please enter a reason for suspension." };
      }
      nextStatus = "blocked_temp";
    } else if (action === "block_perm") {
      if (!blockReason) {
        return { error: "Please enter a reason for permanent suspension." };
      }
      nextStatus = "blocked_perm";
    } else if (action === "unblock") {
      nextStatus = "approved";
    } else {
      return { error: "Invalid verification action." };
    }

    // 1. Update verification_status
    const { error: profileError } = await supabase
      .from("fundraiser_profiles")
      .update({
        verification_status: nextStatus,
        rejection_reason: clearRejection ? null : rejectionReason
      })
      .eq("id", id);

    if (profileError) {
      return { error: "Failed to update profile verification status: " + profileError.message };
    }

    // 2. Insert into block_history if blocking/unblocking
    if (action === "block_temp" || action === "block_perm") {
      const { error: blockError } = await supabase
        .from("block_history")
        .insert({
          fundraiser_id: id,
          blocked_by: adminUser.id,
          block_type: action === "block_temp" ? "temporary" : "permanent",
          reason: blockReason
        });
      
      if (blockError) {
        console.error("Failed to log block history:", blockError.message);
      }
    } else if (action === "unblock") {
      // Find active blocks and set unblocked_at
      const { error: unblockError } = await supabase
        .from("block_history")
        .update({
          unblocked_at: new Date().toISOString(),
          unblocked_by: adminUser.id
        })
        .eq("fundraiser_id", id)
        .is("unblocked_at", null);

      if (unblockError) {
        console.error("Failed to update unblock log:", unblockError.message);
      }
    }

    revalidatePath("/admin/fundraisers");
    revalidatePath(`/admin/fundraisers/${id}`);
  } catch (err: any) {
    return { error: err.message };
  }

  redirect("/admin/fundraisers");
}
