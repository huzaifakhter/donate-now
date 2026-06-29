import { createClient } from "@/lib/supabase/server";
import { resubmitOnboarding } from "@/app/actions/onboarding";
import { signOut } from "@/app/actions/auth";
import { AlertOctagon, LogOut, Edit2 } from "lucide-react";
import Link from "next/link";

export default async function RejectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch rejection reason
  const { data: profile } = await supabase
    .from("fundraiser_profiles")
    .select("rejection_reason")
    .eq("id", user?.id || "")
    .single();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl border border-outline-variant/30 card-shadow">
        {/* Rejection Icon */}
        <div className="w-16 h-16 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <AlertOctagon className="h-8 w-8" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface font-display-lg">
            Application Verification Failed
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We were unable to approve your fundraiser application based on the information and documents provided.
          </p>
          
          {/* Rejection Reason Card */}
          <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 text-left mt-4">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider block mb-1">
              Feedback from Administrators:
            </span>
            <p className="text-sm text-red-900 font-semibold leading-relaxed">
              {profile?.rejection_reason || "No specific feedback was provided. Please verify all registration and tax documents are valid and resubmit."}
            </p>
          </div>
        </div>

        {/* Action Button to Resubmit */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-3">
          <form action={resubmitOnboarding}>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-semibold text-sm px-4 py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Edit2 className="h-4 w-4" />
              Revise & Resubmit Application
            </button>
          </form>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full bg-slate-100 text-on-surface-variant font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
          <Link href="/" className="text-xs font-semibold text-secondary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
