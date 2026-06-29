"use client";

import { useState, useActionState } from "react";
import { saveStep4, uploadDocument, deleteDocument } from "@/app/actions/onboarding";
import { ArrowLeft, ArrowRight, Upload, Trash2, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

interface BankDetails {
  account_holder_name?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_swift?: string;
  branch?: string;
  cheque_file_url?: string;
}

export default function BankingInformationForm({
  initialDetails,
  initialChequeName,
}: {
  initialDetails: BankDetails | null;
  initialChequeName: string;
}) {
  const [state, formAction, isPending] = useActionState(saveStep4, null);
  const [chequeUrl, setChequeUrl] = useState<string>(initialDetails?.cheque_file_url || "");
  const [chequeName, setChequeName] = useState<string>(initialChequeName || "");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle cancelled cheque upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", "bank_proof");

    try {
      const res = await uploadDocument(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.fileUrl) {
        setChequeUrl(res.fileUrl);
        setChequeName(res.fileName || file.name);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  // Handle cancelled cheque deletion
  const handleDelete = async () => {
    if (!chequeUrl) return;

    setError(null);
    try {
      const res = await deleteDocument("", chequeUrl);
      if (res.error) {
        setError(res.error);
      } else {
        setChequeUrl("");
        setChequeName("");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during deletion.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Banking & Payout Account
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Enter banking details where payouts for your campaigns will be transferred.
        </p>
      </div>

      {(state?.error || error) && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm font-medium text-red-800">{state?.error || error}</div>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        {/* Hidden Input to store cheque URL */}
        <input type="hidden" name="chequeFileUrl" value={chequeUrl} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="accountHolderName" className="block text-sm font-semibold text-on-surface-variant">
              Account Holder Name
            </label>
            <input
              id="accountHolderName"
              name="accountHolderName"
              type="text"
              required
              defaultValue={initialDetails?.account_holder_name || ""}
              placeholder="e.g. Save The Children Foundation"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bankName" className="block text-sm font-semibold text-on-surface-variant">
              Bank Name
            </label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              required
              defaultValue={initialDetails?.bank_name || ""}
              placeholder="e.g. JPMorgan Chase Bank"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="accountNumber" className="block text-sm font-semibold text-on-surface-variant">
              Account Number
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              required
              defaultValue={initialDetails?.account_number || ""}
              placeholder="e.g. 1234567890"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="ifscSwift" className="block text-sm font-semibold text-on-surface-variant">
              IFSC / SWIFT Code
            </label>
            <input
              id="ifscSwift"
              name="ifscSwift"
              type="text"
              required
              defaultValue={initialDetails?.ifsc_swift || ""}
              placeholder="e.g. CHASUS33"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="branch" className="block text-sm font-semibold text-on-surface-variant">
              Branch Location
            </label>
            <input
              id="branch"
              name="branch"
              type="text"
              required
              defaultValue={initialDetails?.branch || ""}
              placeholder="e.g. New York Main Branch"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          {/* Cancelled Cheque upload */}
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Bank Proof / Cancelled Cheque (optional)
            </label>
            {chequeUrl ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-sm truncate max-w-xs">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{chequeName || "Bank_Proof_File"}</span>
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-gray-50 cursor-pointer transition-all w-fit mt-1">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Bank Proof"}
                <input
                  type="file"
                  disabled={uploading}
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-outline-variant/20">
          <Link
            href="/onboarding/step-3"
            className="border border-[#CBD5E1] text-on-surface-variant font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save & Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
