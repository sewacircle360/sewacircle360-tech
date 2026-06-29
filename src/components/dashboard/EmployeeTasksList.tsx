"use client";

import { useState } from "react";
import { completeTaskAction } from "@/modules/tasks/actions/completeTask";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: string;
  status: string;
}

interface EmployeeTasksListProps {
  initialTasks: Task[];
}

export function EmployeeTasksList({ initialTasks }: EmployeeTasksListProps) {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const router = useRouter();

  const handleComplete = async (taskId: string) => {
    setLoadingTaskId(taskId);
    try {
      const res = await completeTaskAction(taskId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to complete task");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTaskId(null);
    }
  };

  if (initialTasks.length === 0) {
    return <p className="text-xs text-slate-500 py-4 text-center">No pending tasks assigned.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <th className="py-2.5 w-8">Check</th>
            <th className="py-2.5">Task Title</th>
            <th className="py-2.5">Due Date</th>
            <th className="py-2.5 text-right">Priority</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800 text-slate-700 dark:text-slate-350">
          {initialTasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/5 transition-colors group">
              <td className="py-3">
                <button
                  type="button"
                  onClick={() => handleComplete(task.id)}
                  disabled={loadingTaskId !== null}
                  className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 hover:bg-green-500/10 hover:border-green-500 transition-colors cursor-pointer disabled:opacity-50"
                  title="Mark as Complete"
                >
                  {loadingTaskId === task.id ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  ) : (
                    <Check className="h-3.5 w-3.5 text-transparent group-hover:text-green-500 hover:text-green-500" />
                  )}
                </button>
              </td>
              <td className="py-3 font-semibold text-slate-900 dark:text-white">{task.title}</td>
              <td className="py-3 text-slate-500">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
              </td>
              <td className="py-3 text-right">
                <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded uppercase ${
                  task.priority === "URGENT" || task.priority === "HIGH" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  task.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                }`}>
                  {task.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
