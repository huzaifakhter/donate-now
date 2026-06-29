import { signOut } from "@/app/actions/auth";
import { ShieldAlert, LogOut, Mail } from "lucide-react";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-xl border border-outline-variant/30 card-shadow">
        {/* Block Icon */}
        <div className="w-16 h-16 bg-red-100 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-on-surface font-display-lg">
            Access Suspended
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Your fundraiser account has been suspended by platform administrators. You are restricted from creating or editing campaigns and accessing the fundraiser portal.
          </p>
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg text-xs text-on-surface-variant font-medium mt-4 flex items-center justify-center gap-2">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            Contact Support: <span className="font-bold text-on-surface">support@donatenow.com</span>
          </div>
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
