"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="text-center block font-display-lg text-display-lg font-bold text-primary">
          Donate Now
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-on-surface font-display-lg">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-outline-variant/30 card-shadow">
          <form className="space-y-6" action={formAction}>
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
                  placeholder="admin@donatenow.com"
                  className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-semibold text-secondary hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-on-surface-variant font-medium">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Create one now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
