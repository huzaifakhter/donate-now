"use client";

import { useActionState } from "react";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { CURRENCIES } from "@/lib/utils";

interface CategoryOption {
  id: string;
  name: string;
}

interface CampaignData {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  category_id: string | null;
  status: string;
  currency: string;
  image_url: string | null;
}

export default function FundraiserCampaignForm({
  categories,
  initialData = null,
  isAdmin = false,
  fundraisers = [], // Admin can select fundraiser
}: {
  categories: CategoryOption[];
  initialData?: CampaignData | null;
  isAdmin?: boolean;
  fundraisers?: { id: string; org_name: string; email: string }[];
}) {
  const isEditMode = !!initialData;
  const action = isEditMode ? updateCampaign : createCampaign;
  const [state, formAction, isPending] = useActionState(action, null);

  const getBackLink = () => {
    return isAdmin ? "/admin/campaigns" : "/fundraiser/campaigns";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={getBackLink()}
          className="p-2 border border-slate-200/60 rounded-md hover:bg-slate-50 transition-all shrink-0 cursor-pointer bg-white flex items-center justify-center h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4 text-on-surface-variant" />
        </Link>
        <div>
          <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
            {isEditMode ? "Edit Campaign" : "Create Campaign"}
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            {isEditMode ? "Update details of your existing campaign." : "Start a new campaign to receive donations."}
          </p>
        </div>
      </div>

      {state?.error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-xs font-semibold text-red-800">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="bg-white rounded-lg border border-slate-200/60 p-5 space-y-5">
        {/* Hidden Fields */}
        {isEditMode && <input type="hidden" name="id" value={initialData.id} />}

        {/* Admin Field: Select Fundraiser */}
        {!isEditMode && isAdmin && fundraisers.length > 0 && (
          <div>
            <label htmlFor="fundraiserId" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Campaign Owner (Fundraiser)
            </label>
            <select
              id="fundraiserId"
              name="fundraiserId"
              required
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface bg-white focus:border-primary focus:outline-none"
            >
              {fundraisers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.org_name || f.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="title" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Campaign Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initialData?.title || ""}
              placeholder="e.g. Clean Drinking Water for Community Village"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Campaign Description / Story
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              defaultValue={initialData?.description || ""}
              placeholder="Explain why you are raising funds, how they will be used, and the impact they will have..."
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none resize-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="categoryId" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={initialData?.category_id || ""}
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface bg-white focus:border-primary focus:outline-none"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              required
              defaultValue={initialData?.currency || "USD"}
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface bg-white focus:border-primary focus:outline-none"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetAmount" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Target Goal Amount
            </label>
            <input
              id="targetAmount"
              name="targetAmount"
              type="number"
              required
              step="0.01"
              min="1"
              defaultValue={initialData?.target_amount || ""}
              placeholder="e.g. 10000.00"
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="imageUrl" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Cover Image URL
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={initialData?.image_url || ""}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={initialData?.status || "draft"}
              className="mt-1 block w-full rounded-md border border-[#CBD5E1] px-3 py-1.5 text-xs text-on-surface bg-white focus:border-primary focus:outline-none"
            >
              <option value="draft">Draft (Private)</option>
              <option value="active">Active (Public/Receiving Donations)</option>
              <option value="paused">Paused (Public/Read Only)</option>
              {isEditMode && <option value="completed">Completed (Goal Met)</option>}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200/60 gap-2.5">
          <Link
            href={getBackLink()}
            className="h-9 px-4 py-2 border border-slate-200/60 text-slate-600 hover:bg-slate-50 text-xs font-medium rounded-md flex items-center justify-center transition-colors cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="h-9 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : isEditMode ? "Update Campaign" : "Launch Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
