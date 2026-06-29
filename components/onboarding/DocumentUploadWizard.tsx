"use client";

import { useState } from "react";
import { uploadDocument, deleteDocument, saveStep3 } from "@/app/actions/onboarding";
import { ArrowLeft, ArrowRight, Upload, Trash2, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

interface DocRecord {
  id?: string;
  doc_type: string;
  file_url: string;
  file_name: string;
}

export default function DocumentUploadWizard({
  initialDocs,
}: {
  initialDocs: DocRecord[];
}) {
  const [docs, setDocs] = useState<DocRecord[]>(initialDocs);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const requiredTypes = [
    { type: "reg_certificate", label: "Govt Registration Certificate" },
    { type: "tax_reg", label: "Tax Registration (e.g., 501(c)(3) or local tax ID)" },
    { type: "id_proof", label: "Identity Proof of Contact Person" },
  ];

  const optionalTypes = [
    { type: "ngo_certificate", label: "NGO Certificate (if applicable)" },
    { type: "address_proof", label: "Address Proof of Office" },
  ];

  // Check if document type is uploaded
  const getUploadedDoc = (type: string) => {
    return docs.find((d) => d.doc_type === type);
  };

  // Handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading((prev) => ({ ...prev, [type]: true }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", type);

    try {
      const res = await uploadDocument(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.fileUrl) {
        // Refetch/update list
        setDocs((prev) => [
          ...prev.filter((d) => d.doc_type !== type),
          {
            doc_type: type,
            file_url: res.fileUrl,
            file_name: res.fileName || file.name,
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Handle file deletion
  const handleDelete = async (doc: DocRecord) => {
    if (!doc.id && !doc.file_url) return;

    setError(null);
    try {
      // Find database ID if possible, otherwise we match by URL or refetch
      const docId = docs.find((d) => d.doc_type === doc.doc_type)?.id || "";
      const res = await deleteDocument(docId, doc.file_url);

      if (res.error) {
        setError(res.error);
      } else {
        setDocs((prev) => prev.filter((d) => d.doc_type !== doc.doc_type));
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during deletion.");
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await saveStep3();
    if (res?.error) {
      setError(res.error);
    }
  };

  // Check if required files are ready
  const canContinue = requiredTypes.every((t) => getUploadedDoc(t.type));

  const renderUploadCard = (type: string, label: string, isRequired: boolean) => {
    const doc = getUploadedDoc(type);
    const isFileUploading = uploading[type];

    return (
      <div key={type} className="border border-outline-variant/30 rounded-xl p-5 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-on-surface">{label}</span>
            {isRequired ? (
              <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-100">REQUIRED</span>
            ) : (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold">OPTIONAL</span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant">
            Upload PDF, PNG, JPG, or JPEG format (max 5MB).
          </p>
        </div>

        <div>
          {doc ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-sm max-w-xs md:max-w-md overflow-hidden">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate font-medium">{doc.file_name}</span>
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(doc)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all shrink-0 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#CBD5E1] rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-gray-50 cursor-pointer transition-all">
              <Upload className="h-4 w-4" />
              {isFileUploading ? "Uploading..." : "Choose File"}
              <input
                type="file"
                disabled={isFileUploading}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleUpload(e, type)}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Legal Verification Documents
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Upload legal documents to verify your organization status. These files will be stored securely.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm font-medium text-red-800">{error}</div>
        </div>
      )}

      {/* Required section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Required Documents
        </h3>
        <div className="space-y-3">
          {requiredTypes.map((t) => renderUploadCard(t.type, t.label, true))}
        </div>
      </div>

      {/* Optional section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Optional Documents
        </h3>
        <div className="space-y-3">
          {optionalTypes.map((t) => renderUploadCard(t.type, t.label, false))}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-outline-variant/20">
        <Link
          href="/onboarding/step-2"
          className="border border-[#CBD5E1] text-on-surface-variant font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="bg-primary text-on-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
        >
          Save & Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
