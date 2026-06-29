"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteUserProfile } from "@/app/actions/profiles";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      startTransition(async () => {
        const res = await deleteUserProfile(userId);
        if (res?.error) {
          alert(`Error deleting user: ${res.error}`);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 rounded-md border border-destructive/20 hover:border-destructive bg-background hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
      title="Delete User"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
