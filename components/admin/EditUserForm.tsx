"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateUserProfile } from "@/app/actions/profiles";

interface EditUserFormProps {
  userId: string;
  initialName: string;
  initialRole: string;
}

export default function EditUserForm({ userId, initialName, initialRole }: EditUserFormProps) {
  // Bind userId to the server action
  const updateUserWithId = updateUserProfile.bind(null, userId);
  const [state, formAction, isPending] = useActionState(updateUserWithId, null);

  return (
    <form className="space-y-6" action={formAction}>
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-on-surface-variant">
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={initialName}
            className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-semibold text-on-surface-variant">
          Role
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            defaultValue={initialRole}
            className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          >
            <option value="fundraiser">Fundraiser</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm font-medium text-red-800">{state.error}</div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
        <Link
          href="/admin/users"
          className="h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors cursor-pointer"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="h-9 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium shadow transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
