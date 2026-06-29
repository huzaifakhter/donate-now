"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(state: any, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) {
    return { error: "Category name is required" };
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("categories")
      .insert({ name, slug });

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: "Database operation failed. Make sure tables exist and RLS permits insert." };
  }

  revalidatePath("/admin/categories");
  return { success: "Category created successfully!" };
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }
  } catch (err: any) {
    return { error: "Failed to delete category from database." };
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
