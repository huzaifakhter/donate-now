"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createUserProfile } from "@/app/actions/profiles";

export default function NewUserPage() {
  const [state, formAction, isPending] = useActionState(createUserProfile, null);

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
            Add New User
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Create a new administrative or fundraiser login account.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl border border-outline-variant/30 p-6 card-shadow">
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
                placeholder="Jane Doe"
                className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant">
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane.doe@example.com"
                className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant">
              Login Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
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
                defaultValue="fundraiser"
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
              className="px-4 py-2 border border-outline-variant/30 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="bg-primary text-on-primary font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isPending ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
