"use client";

import { useState } from "react";
import { deleteCampaign, toggleCampaignStatus } from "@/app/actions/campaigns";
import { Check, Pause, Play, Edit, Trash2, Megaphone } from "lucide-react";
import Link from "next/link";
import { getCurrencySymbol } from "@/lib/utils";

interface CampaignItem {
  id: string;
  title: string;
  target_amount: number;
  raised_amount: number;
  status: string;
  currency: string;
  category_name: string;
  fundraiser_name: string;
  created_at: string;
}

export default function AdminCampaignList({
  initialCampaigns,
}: {
  initialCampaigns: CampaignItem[];
}) {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialCampaigns);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setError(null);
    setLoading((prev) => ({ ...prev, [id + "-status"]: true }));
    try {
      const res = await toggleCampaignStatus(id, currentStatus);
      if (res.error) {
        setError(res.error);
      } else {
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, status: currentStatus === "active" ? "paused" : "active" }
              : c
          )
        );
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading((prev) => ({ ...prev, [id + "-status"]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;

    setError(null);
    setLoading((prev) => ({ ...prev, [id + "-delete"]: true }));
    try {
      const res = await deleteCampaign(id);
      if (res.error) {
        setError(res.error);
      } else {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading((prev) => ({ ...prev, [id + "-delete"]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
            Active
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            Paused
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white border border-slate-950">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-200/60">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-on-surface-variant border-b border-slate-200/60">
                <th className="px-5 py-2.5">Campaign</th>
                <th className="px-5 py-2.5">Category</th>
                <th className="px-5 py-2.5">Fundraiser</th>
                <th className="px-5 py-2.5 text-right">Goal Progress</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant font-medium">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => {
                  const percent = c.target_amount > 0 ? Math.min(100, Math.round((c.raised_amount / c.target_amount) * 100)) : 0;
                  const isActionLoading = loading[c.id + "-status"] || loading[c.id + "-delete"];
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/30">
                      <td className="px-5 py-3 max-w-[220px]">
                        <div className="font-bold truncate" title={c.title}>
                          {c.title}
                        </div>
                        <div className="text-[10px] text-on-surface-variant font-semibold" suppressHydrationWarning>
                          Created {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold text-on-surface-variant">
                        {c.category_name}
                      </td>
                      <td className="px-5 py-3 font-medium text-on-surface-variant">
                        {c.fundraiser_name}
                      </td>
                      <td className="px-5 py-3 text-right min-w-[150px]">
                        <div className="flex items-center justify-between text-[10px] font-bold text-on-surface mb-1">
                          <span>{getCurrencySymbol(c.currency)}{c.raised_amount.toLocaleString()}</span>
                          <span className="text-on-surface-variant font-medium">
                            of {getCurrencySymbol(c.currency)}{c.target_amount.toLocaleString()} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {getStatusBadge(c.status)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status !== "completed" && c.status !== "draft" && (
                            <button
                              onClick={() => handleToggleStatus(c.id, c.status)}
                              disabled={isActionLoading}
                              className={`h-8 w-8 rounded-md border transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 bg-background ${
                                c.status === "active" 
                                  ? "text-amber-600 border-amber-200 hover:bg-amber-50" 
                                  : "text-green-600 border-green-200 hover:bg-green-50"
                              }`}
                              title={c.status === "active" ? "Pause Campaign" : "Resume Campaign"}
                            >
                              {c.status === "active" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <Link
                            href={`/admin/campaigns/${c.id}/edit`}
                            className="h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={isActionLoading}
                            className="h-8 w-8 rounded-md border border-destructive/20 hover:border-destructive bg-background hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                            title="Delete campaign"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
