"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/modules/projects/actions/projects";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProject(projectId);
      router.refresh();
    });
  };

  if (!showConfirm) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        title="Delete project"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-red-500/5 border border-red-500/20 rounded-xl px-2 py-1.5">
      <span className="text-[9px] font-bold text-red-400 leading-tight max-w-24 truncate">Delete &ldquo;{projectName}&rdquo;?</span>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-[9px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded cursor-pointer shrink-0"
      >
        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes"}
      </button>
      <button
        onClick={() => setShowConfirm(false)}
        className="text-[9px] font-bold text-slate-500 px-1 rounded cursor-pointer shrink-0"
      >
        No
      </button>
    </div>
  );
}
