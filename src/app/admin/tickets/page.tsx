import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTicketsForAdmin } from "@/modules/tickets/actions/tickets";
import Link from "next/link";
import { LifeBuoy, Clock, CheckCircle2, User, UserCheck, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Support Tickets Review | Admin OS",
  description: "Manage client support tickets and assignments.",
};

export default async function AdminTicketsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const tickets = await getTicketsForAdmin();

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CRITICAL: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
  };

  const statusColors: Record<string, string> = {
    OPEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-green-500/10 text-green-500 border-green-500/20",
    CLOSED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-6xl mx-auto">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#090d1f]/60 p-6 rounded-2xl border dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-xl">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display">
              Support Ticketing Center
            </h1>
            <p className="text-xs text-slate-450 mt-0.5">
              Review and assign client support tickets, resolve engineering requests, and exchange comments.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of status bins */}
      <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm p-6 flex flex-col gap-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b dark:border-slate-850 pb-3">
          All System Tickets ({tickets.length})
        </span>

        {tickets.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2.5">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
            <p className="text-xs text-slate-450">Everything is clean! No tickets submitted by any clients.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((t) => (
              <div 
                key={t.id} 
                className="p-4 bg-slate-50 dark:bg-slate-950/45 border dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300"
              >
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[8px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider ${priorityColors[t.priority]}`}>
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">{t.category.replace("_", " ")}</span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">/ {t.client.companyName}</span>
                  </div>
                  
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {t.subject}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>Opened: {new Date(t.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="text-slate-350">|</span>
                    <span className="text-slate-450 font-semibold">{t.client.ownerName} ({t.client.email})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 dark:border-slate-900">
                  {/* Status */}
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 border rounded-lg uppercase tracking-wider ${statusColors[t.status]}`}>
                    {t.status.replace("_", " ")}
                  </span>
                  
                  {/* Assigned Info */}
                  <div className="text-[10px] font-semibold text-slate-500">
                    {t.assignedEmployee ? (
                      <span className="flex items-center gap-1 text-slate-650 dark:text-slate-300 font-bold uppercase text-[9px]">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                        {t.assignedEmployee.name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 font-bold uppercase text-[9px]">
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                        Unassigned
                      </span>
                    )}
                  </div>

                  <Link 
                    href={`/admin/tickets/${t.id}`}
                    className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
