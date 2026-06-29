"use client";

import { useActionState, useState } from "react";
import { donateToCampaign } from "@/app/actions/donations";
import { getCurrencySymbol } from "@/lib/utils";
import { Heart, Landmark, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CampaignData {
  id: string;
  title: string;
  currency: string;
}

export default function PublicDonationForm({ campaign }: { campaign: CampaignData }) {
  const [state, formAction, isPending] = useActionState(donateToCampaign, null);
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const symbol = getCurrencySymbol(campaign.currency);

  const presets = ["10", "25", "50", "100", "250"];

  if (state?.success) {
    return (
      <div className="bg-white rounded-lg border border-slate-200/60 p-6 space-y-6 text-center animate-in fade-in duration-300 max-w-md mx-auto shadow-sm">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900">Thank You for Your Support!</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your generous contribution of <span className="font-bold text-slate-900">{symbol}{state.donationAmount}</span> has been processed successfully to support:
          </p>
          <div className="bg-slate-50 rounded-md p-3 font-semibold text-xs text-slate-700 italic border border-slate-100">
            "{state.campaignTitle}"
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/"
            className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Explore Other Causes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-lg p-5 space-y-5 shadow-sm max-w-md mx-auto">
      <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3">
        <Heart className="h-5 w-5 text-primary fill-current" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Make a Donation</h2>
          <p className="text-[10px] text-slate-500 font-medium">100% of proceeds go directly to this cause</p>
        </div>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3.5 border border-red-200 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="campaignId" value={campaign.id} />

        {/* Preset Amounts */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Select Contribution Amount
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`py-1.5 text-xs font-bold rounded-md border text-center transition-colors cursor-pointer ${
                  selectedAmount === amt
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {symbol}{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label htmlFor="amount" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Or Enter Custom Amount ({campaign.currency})
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 text-xs font-bold">{symbol}</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              required
              min="1"
              step="0.01"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
              placeholder="0.00"
              className="block w-full rounded-md border border-[#CBD5E1] pl-7 pr-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Donor Name */}
        <div>
          <label htmlFor="donorName" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Your Full Name
          </label>
          <input
            type="text"
            name="donorName"
            id="donorName"
            required
            placeholder="e.g. Jane Doe"
            className="block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-slate-900 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Donor Email */}
        <div>
          <label htmlFor="donorEmail" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="donorEmail"
            id="donorEmail"
            required
            placeholder="e.g. jane.doe@example.com"
            className="block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-slate-900 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Security badges */}
        <div className="bg-slate-50 border border-slate-100 rounded-md p-3 space-y-2 text-[10px] font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Secure SSL Encrypted Transactions</span>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Direct Payout Transfer to Verified Cause NGO</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-9 w-full bg-primary text-white hover:bg-primary/90 text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <HeartHandshake className="h-4 w-4" />
          {isPending ? "Processing Donation..." : "Complete Donation Now"}
        </button>
      </form>
    </div>
  );
}
