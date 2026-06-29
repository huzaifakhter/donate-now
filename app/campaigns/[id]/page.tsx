import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrencySymbol } from "@/lib/utils";
import PublicDonationForm from "@/components/public/DonationForm";
import { Megaphone, Heart, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicCampaignDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select(`
      id,
      title,
      description,
      target_amount,
      raised_amount,
      status,
      currency,
      image_url,
      created_at,
      categories (
        name
      ),
      profiles (
        full_name
      )
    `)
    .eq("id", id)
    .single();

  if (!campaign || campaign.status !== "active") {
    notFound();
  }

  const percent = campaign.target_amount > 0 ? Math.min(100, Math.round((campaign.raised_amount / campaign.target_amount) * 100)) : 0;
  const symbol = getCurrencySymbol(campaign.currency);
  const categoryName = (campaign.categories as any)?.name || "General";
  const fundraiserName = (campaign.profiles as any)?.full_name || "Verified Partner";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shrink-0">
              <Heart className="h-3.5 w-3.5 text-white fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">DonateNow</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Back to Campaigns
          </Link>
        </div>
      </header>

      {/* Main Campaign Details */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Story details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="w-full h-72 md:h-96 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200/60 shadow-sm">
              {campaign.image_url ? (
                <Image
                  src={campaign.image_url}
                  alt={campaign.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Megaphone className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {categoryName}
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Launched {new Date(campaign.created_at).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                {campaign.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Organized by: <span className="text-slate-800 font-bold">{fundraiserName}</span> (Verified Campaign Partner)
              </p>
            </div>

            {/* Campaign Story */}
            <div className="bg-white rounded-lg border border-slate-200/60 p-5 space-y-3.5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2">
                Campaign Story & Target Cause
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Right Side: Progress tracker & Donation checkout box */}
          <div className="space-y-6">
            
            {/* Goal Progress display card */}
            <div className="bg-white rounded-lg border border-slate-200/60 p-5 space-y-4 shadow-sm">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Funding Progress
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">
                    {symbol}{campaign.raised_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">raised</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                  of {symbol}{campaign.target_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} goal ({percent}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>

            {/* Donation Form */}
            <PublicDonationForm campaign={campaign} />

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            DonateNow — Transparent & Secure Crowdfunding Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
