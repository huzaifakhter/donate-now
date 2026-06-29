import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import SearchInput from "@/components/admin/SearchInput";
import DeleteUserButton from "@/components/admin/DeleteUserButton";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

async function getUsers(search?: string, roleFilter?: string): Promise<Profile[]> {
  const defaultUsers: Profile[] = [
    {
      id: "admin-1",
      email: "admin@donatenow.com",
      full_name: "System Administrator",
      role: "admin",
      created_at: new Date().toISOString(),
    },
    {
      id: "fundraiser-1",
      email: "john.doe@example.com",
      full_name: "John Doe",
      role: "fundraiser",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: "fundraiser-2",
      email: "jane.smith@example.com",
      full_name: "Jane Smith",
      role: "fundraiser",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
  ];

  try {
    const supabase = await createClient();
    let query = supabase.from("profiles").select("*");

    if (roleFilter) {
      query = query.eq("role", roleFilter);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.error("Failed to query profiles, falling back to mock users:", error);
  }

  // Fallback filtering
  let filtered = [...defaultUsers];
  if (roleFilter) {
    filtered = filtered.filter((u) => u.role === roleFilter);
  }
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.email.toLowerCase().includes(term) ||
        u.full_name.toLowerCase().includes(term)
    );
  }
  return filtered;
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  const role = params.role;

  const users = await getUsers(search, role);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
            User Management
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Manage administrative credentials, fundraisers, and roles.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium rounded-md shadow transition-colors flex items-center gap-2 self-start cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200/60 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchInput placeholder="Search by name or email..." />
        
        {/* Role filter tab link mockup */}
        <div className="flex gap-1.5 text-xs font-semibold">
          <Link
            href="/admin/users"
            className={`px-3 py-1.5 rounded-md border ${
              !role
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Roles
          </Link>
          <Link
            href="/admin/users?role=admin"
            className={`px-3 py-1.5 rounded-md border ${
              role === "admin"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Admins
          </Link>
          <Link
            href="/admin/users?role=fundraiser"
            className={`px-3 py-1.5 rounded-md border ${
              role === "fundraiser"
                ? "bg-primary text-white border-primary shadow-sm"
                : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Fundraisers
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-on-surface-variant border-b border-slate-200/60">
                <th className="px-5 py-2.5">Full Name</th>
                <th className="px-5 py-2.5">Email Address</th>
                <th className="px-5 py-2.5">Role</th>
                <th className="px-5 py-2.5">Created At</th>
                <th className="px-5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container-low/50">
                    <td className="px-6 py-4 font-semibold">{user.full_name || "N/A"}</td>
                    <td className="px-6 py-4 font-medium text-on-surface-variant">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Fundraiser"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {new Date(user.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                       <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteUserButton userId={user.id} userName={user.full_name} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
