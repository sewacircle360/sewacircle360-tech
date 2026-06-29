"use client";

import { CheckCircle2, Circle, HelpCircle, Activity, Sparkles } from "lucide-react";

interface SteppedProgressProps {
  status: string;
}

const STEPS = [
  { label: "Planning", desc: "Scope & architecture", statuses: ["PLANNING"] },
  { label: "Design", desc: "UI/UX wireframes", statuses: ["DESIGN"] },
  { label: "Development", desc: "Engineering code cycles", statuses: ["DEVELOPMENT"] },
  { label: "Testing", desc: "QA & security audit", statuses: ["TESTING"] },
  { label: "Launch", desc: "Production release", statuses: ["DEPLOYMENT", "COMPLETED", "MAINTENANCE"] },
];

const STATUS_ORDER = ["PLANNING", "DESIGN", "DEVELOPMENT", "TESTING", "DEPLOYMENT", "COMPLETED", "MAINTENANCE"];

export function SteppedProgress({ status }: SteppedProgressProps) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Connector bar layout wrapper */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 w-full">
        {/* Decorative background connector bar for desktop */}
        <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-slate-100 dark:bg-slate-800/80 hidden sm:block -z-10" />

        {STEPS.map((step, idx) => {
          const stepOrderIdxs = step.statuses.map(s => STATUS_ORDER.indexOf(s));
          const isCompleted = stepOrderIdxs.some(orderIdx => currentIdx > orderIdx) || (idx === STEPS.length - 1 && currentIdx >= STATUS_ORDER.indexOf("COMPLETED"));
          const isActive = step.statuses.includes(status) || (idx === STEPS.length - 1 && status === "MAINTENANCE");
          const isPending = !isCompleted && !isActive;

          return (
            <div key={idx} className="flex sm:flex-col items-center gap-4 sm:gap-2 flex-1 w-full sm:text-center group relative">
              {/* Connector step point circle */}
              <div 
                className={`h-11 w-11 rounded-full flex items-center justify-center border shadow-sm transition-all duration-500 relative shrink-0 z-10 ${
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
                <span className={`text-xs font-bold transition-colors ${isActive ? "text-primary dark:text-accent font-extrabold" : "text-slate-800 dark:text-slate-200"}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-0.5 max-w-36">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Stage Highlight Alert */}
      <div className="p-3 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent border dark:border-slate-800/80 rounded-2xl flex items-center gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0" />
        <p className="text-[10px] text-slate-600 dark:text-slate-350 leading-relaxed">
          Your project is currently in the <strong className="text-primary uppercase tracking-wide">{status.replace("_", " ")}</strong> phase. Our engineering team is pushing daily builds.
        </p>
      </div>
    </div>
  );
}
