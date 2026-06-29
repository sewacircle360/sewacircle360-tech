import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getClientByUserId } from "@/modules/clients/actions/clients";
import { getTicketsForClient } from "@/modules/tickets/actions/tickets";
import { NewTicketForm } from "@/modules/tickets/components/NewTicketForm";
import Link from "next/link";
import { LifeBuoy, AlertCircle, Clock, CheckCircle2, User } from "lucide-react";
import { db } from "@/lib/db";

export const metadata = {
  title: "Support Desk | Client Portal",
  description: "Log support tickets and review updates for SewaCircle360 engineering cycles.",
};

export default async function ClientTicketsPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/auth/login");
  }

  let client: any = await getClientByUserId(session.user.id);

  if (!client && (session.user as any).role === "SUPER_ADMIN") {
    const existingClient = await db.client.findFirst();
    if (existingClient) client = existingClient;
  }

  if (!client) {
    redirect("/auth/login");
  }

  const tickets = await getTicketsForClient(client.id);

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
    <div className="flex flex-col gap-6 text-left max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#090d1f]/60 p-6 rounded-2xl border dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
            <LifeBuoy className="h-6 w-6 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display">
              Support Desk
            </h1>
            <p className="text-xs text-slate-450 mt-0.5">
              Open tech support requests and exchange remarks with SewaCircle360 support engineers.
            </p>
          </div>
        </div>
        <NewTicketForm clientId={client.id} />
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm p-6 flex flex-col gap-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b dark:border-slate-850 pb-3">
          Opened Support Tickets ({tickets.length})
        </span>

        {tickets.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2.5">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
            <p className="text-xs text-slate-450">Everything is working flawlessly! No active tickets logged.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((t) => (
              <div 
                key={t.id} 
                className="p-4 bg-slate-50 dark:bg-slate-950/45 border dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[8px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider ${priorityColors[t.priority] || "bg-slate-500/10 text-slate-500"}`}>
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">{t.category.replace("_", " ")}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {t.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>Opened: {new Date(t.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {t.assignedEmployee && (
                      <>
                        <span className="text-slate-350">|</span>
                        <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary">
                          <User className="h-2.5 w-2.5" />
                          <span>{t.assignedEmployee.name}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 dark:border-slate-900">
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 border rounded-lg uppercase tracking-wider ${statusColors[t.status] || "bg-slate-500/10 text-slate-500"}`}>
                    {t.status.replace("_", " ")}
                  </span>
                  <Link 
                    href={`/portal/tickets/${t.id}`}
                    className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/25 hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    View Conversation
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
