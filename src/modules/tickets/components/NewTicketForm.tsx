"use client";

import { useState, useTransition } from "react";
import { createTicketAction } from "../actions/tickets";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewTicketFormProps {
  clientId: string;
}

const CATEGORIES = ["BUG", "FEATURE_REQUEST", "BILLING", "SUPPORT_INQUIRY", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function NewTicketForm({ clientId }: NewTicketFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("SUPPORT_INQUIRY");
  const [priority, setPriority] = useState("LOW");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setMsg({ type: "error", text: "Subject cannot be empty." });
      return;
    }

    startTransition(async () => {
      const result = await createTicketAction({
        clientId,
        subject,
        category,
        priority,
      });

      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else {
        setMsg({ type: "success", text: "Ticket opened successfully!" });
        setSubject("");
        setTimeout(() => {
          setIsOpen(false);
          setMsg(null);
          router.refresh();
        }, 1500);
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
      >
        <Plus className="h-4 w-4" /> Open Support Ticket
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-[#090d1f] border dark:border-slate-800/80 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 border-b dark:border-slate-800 pb-3 mb-4">
              Open Support Ticket
            </h3>

            {msg && (
              <div className={`p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
                msg.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ticket Subject</label>
                <input
                  type="text"
                  placeholder="Summarise the issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isPending}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isPending}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isPending}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  {PRIORITIES.map(pri => (
                    <option key={pri} value={pri}>{pri}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end border-t dark:border-slate-800 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 border dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
