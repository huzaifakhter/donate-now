import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditUserForm from "@/components/admin/EditUserForm";
import { notFound } from "next/navigation";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

async function getUserProfile(id: string): Promise<Profile | null> {
  const mockUsers = [
    { id: "admin-1", email: "admin@donatenow.com", full_name: "System Administrator", role: "admin" },
    { id: "fundraiser-1", email: "john.doe@example.com", full_name: "John Doe", role: "fundraiser" },
    { id: "fundraiser-2", email: "jane.smith@example.com", full_name: "Jane Smith", role: "fundraiser" },
  ];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) return data;
  } catch (error) {
    console.error("Profiles query failed, looking up mock list:", error);
  }

  // Mock lookup fallback
  return mockUsers.find((u) => u.id === id) || null;
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserProfile(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/users"
          className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
            Edit User Profile
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Update account information and platform privileges for {user.email}.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-outline-variant/30 p-6 card-shadow">
        <EditUserForm
          userId={user.id}
          initialName={user.full_name}
          initialRole={user.role}
        />
      </div>
    </div>
  );
}
