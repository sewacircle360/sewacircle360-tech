"use client";

import { useState, useTransition } from "react";
import { updateTicketStatusAction, assignTicketAction } from "../actions/tickets";
import { Loader2, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface Employee {
  id: string;
  name: string | null;
}

interface TicketStatusActionsProps {
  ticketId: string;
  currentStatus: string;
  currentAssignedId: string | null;
  employees: Employee[];
}

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export function TicketStatusActions({
  ticketId,
  currentStatus,
  currentAssignedId,
  employees
}: TicketStatusActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [assignedId, setAssignedId] = useState(currentAssignedId || "");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateTicketStatusAction(ticketId, newStatus);
      if (result.error) {
        alert(result.error);
        setStatus(currentStatus);
      } else {
        setMsg("Status updated successfully!");
        setTimeout(() => setMsg(null), 2000);
        router.refresh();
      }
    });
  };

  const handleAssignChange = (newAssignId: string) => {
    setAssignedId(newAssignId);
    startTransition(async () => {
      const parsedId = newAssignId === "" ? null : newAssignId;
      const result = await assignTicketAction(ticketId, parsedId);
      if (result.error) {
        alert(result.error);
        setAssignedId(currentAssignedId || "");
      } else {
        setMsg("Assignment updated!");
        setTimeout(() => setMsg(null), 2000);
        router.refresh();
      }
    });
  };

  return (
    <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-4 text-left relative">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-850 pb-2.5 flex items-center justify-between">
        <span>Admin Controls</span>
        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
      </h3>

      {msg && (
        <span className="text-[10px] text-green-500 font-bold">{msg}</span>
      )}

      {/* Ticket Status Select */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Ticket Status</label>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isPending}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-lg outline-none cursor-pointer focus:border-primary text-foreground font-semibold"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {/* Ticket Assignee Select */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Assign Engineer</label>
        <select
          value={assignedId}
          onChange={(e) => handleAssignChange(e.target.value)}
          disabled={isPending}
          className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-800 rounded-lg outline-none cursor-pointer focus:border-primary text-foreground font-semibold"
        >
          <option value="">Unassigned</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name || emp.id}</option>
          ))}
        </select>
      </div>

      <div className="p-3 bg-indigo-500/5 dark:bg-slate-900 border dark:border-slate-850 rounded-xl flex items-start gap-2.5 text-[9px] text-slate-500 leading-normal mt-1">
        <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
        <p>Assigning a ticket automatically shares conversation logs with the developer workspace.</p>
      </div>
    </div>
  );
}
