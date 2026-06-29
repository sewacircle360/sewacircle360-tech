"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Activity, Sparkles, CheckSquare, Square, ChevronDown } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  phase: string;
}

interface SteppedProgressProps {
  status: string;
  tasks?: TaskItem[];
}

const STEPS = [
  { label: "Planning", desc: "Scope & architecture", statuses: ["PLANNING"] },
  { label: "Design", desc: "UI/UX wireframes", statuses: ["DESIGN"] },
  { label: "Development", desc: "Engineering code cycles", statuses: ["DEVELOPMENT"] },
  { label: "Testing", desc: "QA & security audit", statuses: ["TESTING"] },
  { label: "Launch", desc: "Production release", statuses: ["DEPLOYMENT", "COMPLETED", "MAINTENANCE"] },
];

const STATUS_ORDER = ["PLANNING", "DESIGN", "DEVELOPMENT", "TESTING", "DEPLOYMENT", "COMPLETED", "MAINTENANCE"];

export function SteppedProgress({ status, tasks = [] }: SteppedProgressProps) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  // Default to active step or fallback to step 0
  const activeStepIdx = STEPS.findIndex(step => 
    step.statuses.includes(status) || (step.label === "Launch" && status === "MAINTENANCE")
  );
  
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(activeStepIdx >= 0 ? activeStepIdx : 0);

  const selectedStep = STEPS[selectedStepIdx];
  
  // Group and filter tasks for the selected step
  const stepTasks = tasks.filter(task => {
    // Check if task phase falls in selected step statuses
    return selectedStep.statuses.includes(task.phase);
  });

  const completedTasksCount = stepTasks.filter(t => t.status === "DONE").length;

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Connector bar layout wrapper */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 w-full select-none">
        {/* Decorative background connector bar for desktop */}
        <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-slate-100 dark:bg-slate-800/80 hidden sm:block -z-10" />

        {STEPS.map((step, idx) => {
          const stepOrderIdxs = step.statuses.map(s => STATUS_ORDER.indexOf(s));
          const isCompleted = stepOrderIdxs.some(orderIdx => currentIdx > orderIdx) || (idx === STEPS.length - 1 && currentIdx >= STATUS_ORDER.indexOf("COMPLETED"));
          const isActive = step.statuses.includes(status) || (idx === STEPS.length - 1 && status === "MAINTENANCE");
          const isPending = !isCompleted && !isActive;
          const isSelected = selectedStepIdx === idx;

          return (
            <button 
              key={idx} 
              type="button"
              onClick={() => setSelectedStepIdx(idx)}
              className="flex sm:flex-col items-center gap-4 sm:gap-2 flex-1 w-full sm:text-center group relative cursor-pointer outline-none focus:outline-none"
            >
              {/* Connector step point circle */}
              <div 
                className={`h-11 w-11 rounded-full flex items-center justify-center border shadow-sm transition-all duration-350 relative shrink-0 z-10 ${
                  isSelected
                    ? "ring-4 ring-primary/30 border-primary scale-105"
                    : ""
                } ${
                  isCompleted 
                    ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white border-emerald-500/30" 
                    : isActive 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105 animate-pulse" 
                    : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800"
                }`}
              >
                {isCompleted && <CheckCircle2 className="h-5 w-5" />}
                {isActive && <Activity className="h-5 w-5 animate-spin" style={{ animationDuration: "3s" }} />}
                {isPending && <Circle className="h-4 w-4 fill-current opacity-40" />}

                {/* Glowing target node effect */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-primary/20 animate-ping opacity-75" />
                )}
              </div>

              {/* Step info label text */}
              <div className="flex flex-col sm:items-center text-left sm:text-center">
                <span className={`text-xs font-bold transition-colors ${
                  isSelected ? "text-primary dark:text-accent font-extrabold" : "text-slate-800 dark:text-slate-200"
                }`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-0.5 max-w-36">
                  {step.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Interactive Phase Drilldown Panel */}
      <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 border dark:border-slate-800/80 rounded-2xl flex flex-col gap-3">
        <div className="flex justify-between items-center border-b dark:border-slate-850 pb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-primary shrink-0" />
            {selectedStep.label} Deliverables &amp; Tasks
          </span>
          <span className="text-[9px] font-extrabold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
            {completedTasksCount}/{stepTasks.length} Completed
          </span>
        </div>

        {stepTasks.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-[10px] text-slate-400">No specific features registered for this phase yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {stepTasks.map(task => (
              <div key={task.id} className="flex items-start gap-2.5 p-2 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl transition-all">
                {task.status === "DONE" ? (
                  <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-4 w-4 text-slate-350 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col text-xs">
                  <span className={`font-bold ${task.status === "DONE" ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-800 dark:text-slate-200"}`}>
                    {task.title}
                  </span>
                  {task.description && (
                    <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{task.description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
