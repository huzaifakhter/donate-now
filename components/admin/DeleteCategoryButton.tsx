"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/categories";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      startTransition(async () => {
        const res = await deleteCategory(id);
        if (res?.error) {
          alert(`Error: ${res.error}`);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 rounded-md border border-destructive/20 hover:border-destructive bg-background hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
      title="Delete Category"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
