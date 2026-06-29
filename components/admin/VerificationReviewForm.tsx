"use client";

import { useActionState, useState } from "react";
import { verifyFundraiserAction } from "@/app/actions/admin-verification";
import { Check, X, ShieldAlert, LockOpen, Save, AlertTriangle } from "lucide-react";

export default function VerificationReviewForm({
  fundraiserId,
  currentStatus,
}: {
  fundraiserId: string;
  currentStatus: string;
}) {
  const [state, formAction, isPending] = useActionState(verifyFundraiserAction, null);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const isBlocked = currentStatus === "blocked_temp" || currentStatus === "blocked_perm";

  return (
    <div className="bg-white border border-outline-variant/30 rounded-xl p-6 md:p-8 card-shadow space-y-6">
      <div className="border-b border-outline-variant/10 pb-4">
        <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wider">
          Administrative Decisions
        </h3>
        <p className="text-xs text-on-surface-variant">Approve credentials or restrict portal access</p>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800">
          {state.error}
        </div>
      )}

      {/* Current status overview banner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold bg-slate-50 border border-slate-200/60 p-3.5 rounded-lg text-on-surface">
          <span>Current Account Status:</span>
          <span className={`uppercase font-bold tracking-wider ${
            currentStatus === "approved" ? "text-emerald-700" : currentStatus === "rejected" ? "text-rose-700" : isBlocked ? "text-red-700" : "text-amber-700"
          }`}>
            {currentStatus}
          </span>
        </div>

        {/* Action Form */}
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={fundraiserId} />
          <input type="hidden" name="action" value={selectedAction} />

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Approve button (hide if approved or permanently blocked) */}
            {currentStatus !== "approved" && currentStatus !== "blocked_perm" && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAction("approve");
                  setReason("");
                }}
                className={`h-9 rounded-md px-3 text-xs font-medium transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedAction === "approve"
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-input bg-background hover:bg-accent text-on-surface hover:text-accent-foreground"
                }`}
              >
                <Check className="h-4 w-4" />
                Approve Partner
              </button>
            )}

            {/* Reject button (hide if already rejected or suspended) */}
            {currentStatus !== "rejected" && !isBlocked && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAction("reject");
                  setReason("");
                }}
                className={`h-9 rounded-md px-3 text-xs font-medium transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedAction === "reject"
                    ? "bg-destructive text-destructive-foreground border-destructive shadow-sm"
                    : "border-input bg-background hover:bg-accent text-on-surface hover:text-accent-foreground"
                }`}
              >
                <X className="h-4 w-4" />
                Reject & Request Fix
              </button>
            )}

            {/* Block temporary */}
            {!isBlocked && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAction("block_temp");
                  setReason("");
                }}
                className={`h-9 rounded-md px-3 text-xs font-medium transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedAction === "block_temp"
                    ? "bg-orange-600 border-orange-600 text-white shadow-sm"
                    : "border-input bg-background hover:bg-accent text-on-surface hover:text-accent-foreground"
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                Suspend Account
              </button>
            )}

            {/* Block permanent */}
            {currentStatus !== "blocked_perm" && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAction("block_perm");
                  setReason("");
                }}
                className={`h-9 rounded-md px-3 text-xs font-medium transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedAction === "block_perm"
                    ? "bg-red-800 border-red-800 text-white shadow-sm"
                    : "border-input bg-background hover:bg-accent text-on-surface hover:text-accent-foreground"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                Ban Permanently
              </button>
            )}

            {/* Unblock option if suspended */}
            {isBlocked && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAction("unblock");
                  setReason("");
                }}
                className={`h-9 rounded-md px-3 text-xs font-medium transition-colors border flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedAction === "unblock"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "border-input bg-background hover:bg-accent text-on-surface hover:text-accent-foreground"
                }`}
              >
                <LockOpen className="h-4 w-4" />
                Lift Suspension
              </button>
            )}
          </div>

          {/* Conditional inputs */}
          {selectedAction === "reject" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <label htmlFor="rejectionReason" className="block text-xs font-semibold text-on-surface-variant">
                Rejection Reason (Displayed to Fundraiser)
              </label>
              <textarea
                id="rejectionReason"
                name="rejectionReason"
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Government registration document is expired. Please upload the valid current license..."
                className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none resize-none leading-relaxed"
              ></textarea>
            </div>
          )}

          {(selectedAction === "block_temp" || selectedAction === "block_perm") && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
              <label htmlFor="blockReason" className="block text-xs font-semibold text-on-surface-variant">
                Suspension Reason (Saved to block history)
              </label>
              <textarea
                id="blockReason"
                name="blockReason"
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Reported for suspicious fundraising activity or fraudulent organization details..."
                className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none resize-none leading-relaxed"
              ></textarea>
            </div>
          )}

          {/* Submit Button */}
          {selectedAction && (
            <div className="flex justify-end pt-3 animate-in fade-in duration-100">
              <button
                type="submit"
                disabled={isPending}
                className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isPending ? "Applying decision..." : "Save Decisions"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
