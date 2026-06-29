"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="text-center block font-display-lg text-display-lg font-bold text-primary">
          Donate Now
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-on-surface font-display-lg">
          Create your fundraiser account
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          Or{" "}
          <Link href="/login" className="font-semibold text-secondary hover:underline">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-outline-variant/30 card-shadow">
          <form className="space-y-6" action={formAction}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-on-surface-variant">
                Full Name / Contact Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="organization@example.com"
                  className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            {state?.error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="text-sm font-medium text-red-800">{state.error}</div>
                </div>
              </div>
            )}

            {state?.success && (
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <div className="flex">
                  <div className="text-sm font-medium text-green-800">{state.success}</div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Registering..." : "Get Started"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
