"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect, isRedirectError } from "next/navigation";
import { headers } from "next/headers";

export async function login(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("SERVER LOGIN ERROR:", error);
    return { error: error.message };
  }

  // Fetch user profile to verify role
  let redirectTo = "/";
  let fetchProfileError = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileErr) {
        throw new Error("Profiles table query failed: " + profileErr.message);
      }
      if (!profile) {
        throw new Error("No profile record found in 'profiles' table for this user ID. You need to run the profile sync query.");
      }

      if (profile?.role === "admin") {
        redirectTo = "/admin";
      }
    }
  } catch (err: any) {
    fetchProfileError = err.message;
  }

  if (fetchProfileError) {
    return { error: "Authenticated successfully, but failed to fetch database profile: " + fetchProfileError };
  }

  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Email is required" };
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent to your email!" };
}

export async function resetPassword(state: any, formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}

export async function register(state: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { error: "All fields are required" };
  }

  try {
    const adminClient = await createAdminClient();
    const serverClient = await createClient();

    // 1. Create the user with email_confirm: true to skip confirmation emails
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "fundraiser",
      },
    });

    if (createError) {
      return { error: createError.message };
    }

    // 2. Sign in the newly created user to establish session cookies
    const { error: signInError } = await serverClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { error: "Registration successful, but failed to log in automatically: " + signInError.message };
    }

  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }

  redirect("/onboarding");
}
