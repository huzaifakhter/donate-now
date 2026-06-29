import { signOut } from "@/app/actions/auth";
import { Clock, LogOut } from "lucide-react";
import Link from "next/link";

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl border border-outline-variant/30 card-shadow">
        {/* Clock/Pending Icon */}
        <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Clock className="h-8 w-8" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface font-display-lg">
            Application Awaiting Review
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Thank you for completing your fundraiser profile! Our team is currently reviewing your organization info, bank account details, and legal certificates.
          </p>
          <p className="text-xs text-on-surface-variant bg-slate-50 border border-slate-100 p-3 rounded-lg font-medium mt-4">
            This verification process typically takes **1 to 2 business days**. You will gain full dashboard access automatically once approved.
          </p>
        </div>

        {/* Footer / Sign Out */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col gap-3">
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
