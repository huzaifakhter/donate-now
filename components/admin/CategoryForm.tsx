"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createCategory } from "@/app/actions/categories";

export default function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-white rounded-lg border border-slate-200/60 p-5">
      <h3 className="text-headline-sm font-semibold text-on-surface mb-4">
        Add New Category
      </h3>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-on-surface-variant">
            Category Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Disaster Relief"
              className="block w-full rounded-md border border-[#CBD5E1] px-3 py-2 text-on-surface placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        {state?.error && (
          <div className="text-xs text-red-600 font-semibold">{state.error}</div>
        )}
        {state?.success && (
          <div className="text-xs text-green-600 font-semibold">{state.success}</div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-9 w-full bg-primary text-white hover:bg-primary/90 text-sm font-medium rounded-md shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}
