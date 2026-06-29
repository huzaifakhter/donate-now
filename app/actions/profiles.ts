"use server";

import { createClient as createServer } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Get service role client securely
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin user operations");
  }
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function createUserProfile(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !fullName || !role) {
    return { error: "All fields are required" };
  }

  try {
    const adminClient = getAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    console.error("Auth Admin API not available:", err);
    return { error: "Supabase service key is missing or invalid. Please check your environment variables." };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserProfile(id: string, state: any, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  if (!fullName || !role) {
    return { error: "Full Name and Role are required" };
  }

  try {
    const adminClient = getAdminClient();
    
    // Update auth metadata
    const { error: authError } = await adminClient.auth.admin.updateUserById(id, {
      user_metadata: { full_name: fullName, role },
    });

    if (authError) {
      return { error: authError.message };
    }

    // Update public profile table
    const serverClient = await createServer();
    const { error: dbError } = await serverClient
      .from("profiles")
      .update({ full_name: fullName, role })
      .eq("id", id);

    if (dbError) {
      return { error: dbError.message };
    }
  } catch (err: any) {
    console.error("Fallback profiles update:", err);
    try {
      const serverClient = await createServer();
      const { error: dbError } = await serverClient
        .from("profiles")
        .update({ full_name: fullName, role })
        .eq("id", id);

      if (dbError) return { error: dbError.message };
    } catch (e: any) {
      return { error: "Failed to update profile: " + e.message };
    }
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUserProfile(id: string) {
  try {
    const adminClient = getAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    console.error("Fallback profiles delete:", err);
    try {
      const serverClient = await createServer();
      const { error } = await serverClient.from("profiles").delete().eq("id", id);
      if (error) return { error: error.message };
    } catch (e: any) {
      return { error: "Failed to delete: " + e.message };
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserCurrency(state: any, formData: FormData) {
  try {
    const serverClient = await createServer();
    const { data: { user } } = await serverClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const currency = formData.get("currency") as string;
    if (!currency) throw new Error("Currency is required");

    const { error } = await serverClient
      .from("profiles")
      .update({ currency })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/admin/settings");
    revalidatePath("/fundraiser/settings");
    revalidatePath("/admin");
    revalidatePath("/fundraiser");

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
