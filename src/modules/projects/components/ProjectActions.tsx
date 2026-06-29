"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject, updateProjectStatus, updateProjectProgress } from "@/modules/projects/actions/projects";
import { Trash2, Loader2, ChevronDown } from "lucide-react";

interface ProjectActionsProps {
  projectId: string;
  currentStatus: string;
  currentProgress: number;
  projectSlug: string | null;
}

const STATUS_OPTIONS = [
  "PLANNING", "DESIGN", "DEVELOPMENT", "TESTING", "DEPLOYMENT", "COMPLETED", "MAINTENANCE"
];

export function ProjectActions({ projectId, currentStatus, currentProgress, projectSlug }: ProjectActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [progress, setProgress] = useState(currentProgress);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateProjectStatus(projectId, newStatus);
      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else {
        setMsg({ type: "success", text: "Status updated!" });
        setTimeout(() => setMsg(null), 2000);
      }
    });
  };

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
  };

  const handleProgressSave = () => {
    startTransition(async () => {
      const result = await updateProjectProgress(projectId, progress);
      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else {
        setMsg({ type: "success", text: "Progress updated!" });
        setTimeout(() => setMsg(null), 2000);
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.error) {
        setMsg({ type: "error", text: result.error });
        setShowDeleteConfirm(false);
      } else {
        router.push("/admin/projects");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm p-5 flex flex-col gap-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-800 pb-3">
        Project Controls
      </h2>

      {/* Status selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Progress slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Progress</label>
          <span className="text-xs font-black text-primary dark:text-accent">{progress}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={progress}
          onChange={(e) => handleProgressChange(Number(e.target.value))}
          disabled={isPending}
          className="w-full accent-primary cursor-pointer"
        />
        <button
          onClick={handleProgressSave}
          disabled={isPending || progress === currentProgress}
          className="text-[10px] font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          {isPending ? "Saving..." : "Save Progress"}
        </button>
      </div>

      {/* Feedback */}
      {msg && (
        <p className={`text-[10px] font-bold ${msg.type === "success" ? "text-green-500" : "text-red-500"}`}>
          {msg.text}
        </p>
      )}

      {/* Delete Section */}
      <div className="border-t dark:border-slate-800 pt-4 mt-2">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 w-full text-xs font-bold text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Project
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-red-400 font-medium leading-snug">
              This will permanently delete the project, all its tasks and milestones. Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeletePending}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg cursor-pointer"
              >
                {isDeletePending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
