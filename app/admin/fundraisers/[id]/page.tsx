import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Landmark, User, FileText, CheckCircle, ExternalLink, Megaphone } from "lucide-react";
import VerificationReviewForm from "@/components/admin/VerificationReviewForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FundraiserReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch fundraiser base profile
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .single();

  if (!userProfile) {
    redirect("/admin/fundraisers");
  }

  // Fetch onboarding details
  const { data: profile } = await supabase
    .from("fundraiser_profiles")
    .select("*")
    .eq("id", id)
    .single();

  // Fetch bank details
  const { data: bank } = await supabase
    .from("bank_details")
    .select("*")
    .eq("fundraiser_id", id)
    .single();

  // Fetch uploaded documents
  const { data: docs } = await supabase
    .from("uploaded_documents")
    .select("*")
    .eq("fundraiser_id", id);

  // Fetch campaigns by this fundraiser
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, title, status, target_amount, raised_amount")
    .eq("fundraiser_id", id)
    .is("deleted_at", null);

  const docLabels: Record<string, string> = {
    reg_certificate: "Govt Registration Certificate",
    ngo_certificate: "NGO Certificate",
    tax_reg: "Tax Registration Certificate",
    id_proof: "Identity Proof",
    address_proof: "Address Proof",
    bank_proof: "Cancelled Cheque / Bank Proof",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/fundraisers"
          className="h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="h-4 w-4 text-on-surface-variant" />
        </Link>
        <div>
          <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
            Review Fundraiser Application
          </h1>
          <p className="text-body-md text-on-surface-variant font-medium">
            Review organization details, legal certificates, and verify partner status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Org details card */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 md:p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-base font-bold text-on-surface">Organization Profile</h2>
                <p className="text-xs text-on-surface-variant">Entity registration details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Legal Name</span>
                <span className="font-bold text-on-surface">{profile?.org_name || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Entity Type</span>
                <span className="font-bold text-on-surface">{profile?.org_type || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Registration ID</span>
                <span className="font-bold text-on-surface">{profile?.reg_number || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Year Established</span>
                <span className="font-bold text-on-surface">{profile?.year_established || "N/A"}</span>
              </div>
              {profile?.website && (
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold text-on-surface-variant block">Website</span>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline flex items-center gap-1 w-fit"
                  >
                    {profile.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Representative details card */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 md:p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
              <User className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-base font-bold text-on-surface">Contact Person Details</h2>
                <p className="text-xs text-on-surface-variant">Primary manager contact info</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Full Name</span>
                <span className="font-bold text-on-surface">{profile?.contact_person || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Phone Number</span>
                <span className="font-bold text-on-surface">{profile?.phone || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Email Address</span>
                <span className="font-bold text-on-surface">{userProfile.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Address Location</span>
                <span className="font-bold text-on-surface">
                  {profile?.city ? `${profile.city}, ${profile.state}, ${profile.country}` : "N/A"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-on-surface-variant block">Full Address</span>
                <span className="font-semibold text-on-surface leading-relaxed">{profile?.address || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Banking details card */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 md:p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
              <Landmark className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-base font-bold text-on-surface">Banking Config</h2>
                <p className="text-xs text-on-surface-variant">Settlement banking accounts</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Account Holder Name</span>
                <span className="font-bold text-on-surface">{bank?.account_holder_name || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Bank Name</span>
                <span className="font-bold text-on-surface">{bank?.bank_name || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">Account Number</span>
                <span className="font-bold text-on-surface">{bank?.account_number || "N/A"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-on-surface-variant block">IFSC / SWIFT</span>
                <span className="font-bold text-on-surface">{bank?.ifsc_swift || "N/A"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold text-on-surface-variant block">Branch</span>
                <span className="font-bold text-on-surface">{bank?.branch || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Campaigns owned by this fundraiser */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 md:p-8 card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-4">
              <Megaphone className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-base font-bold text-on-surface">Campaigns Listed ({campaigns?.length || 0})</h2>
                <p className="text-xs text-on-surface-variant">Charity drives created by this fundraiser</p>
              </div>
            </div>
            {campaigns && campaigns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/10 text-xs font-semibold text-on-surface-variant">
                      <th className="py-2.5">Title</th>
                      <th className="py-2.5 text-center">Status</th>
                      <th className="py-2.5 text-right">Goal / Raised</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5 text-xs text-on-surface">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-primary">
                          <Link href={`/admin/campaigns?search=${encodeURIComponent(c.title)}`} className="hover:underline">
                            {c.title}
                          </Link>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            c.status === "active" ? "bg-green-50 border-green-200 text-green-700" : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-on-surface-variant">
                          ${Number(c.raised_amount).toLocaleString()} / ${Number(c.target_amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-on-surface-variant italic py-2">No campaigns launched.</div>
            )}
          </div>
        </div>

        {/* Right Column: Documents and Verification actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Document list card */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 card-shadow space-y-4">
            <div className="border-b border-outline-variant/10 pb-3">
              <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wider">
                Verification Documents
              </h3>
              <p className="text-xs text-on-surface-variant">Uploaded KYC legal files</p>
            </div>
            <div className="space-y-3">
              {docs && docs.length > 0 ? (
                docs.map((d) => (
                  <div key={d.id} className="border border-outline-variant/15 rounded-lg p-3 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0 flex-grow">
                        <span className="font-bold text-[10px] text-on-surface-variant block uppercase tracking-wider leading-none">
                          {docLabels[d.doc_type] || d.doc_type}
                        </span>
                        <span className="text-xs text-on-surface font-semibold truncate block mt-0.5">{d.file_name}</span>
                      </div>
                    </div>
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="h-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs font-medium w-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="h-3 w-3 text-on-surface-variant" />
                      View Document
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-xs text-on-surface-variant italic">No documents uploaded.</div>
              )}
            </div>
          </div>

          {/* Verification decision form */}
          <VerificationReviewForm
            fundraiserId={id}
            currentStatus={profile?.verification_status || "pending"}
          />
        </div>
      </div>
    </div>
  );
}
