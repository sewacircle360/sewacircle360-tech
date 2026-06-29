import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getClientByUserId } from "@/modules/clients/actions/clients";
import { db } from "@/lib/db";
import { getComments } from "@/modules/comments/actions/comments";
import { CommentSection } from "@/modules/comments/components/CommentSection";
import Link from "next/link";
import { LifeBuoy, ArrowLeft, Clock, ShieldCheck, Ticket } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientTicketDetailPage({ params }: Props) {
  const { id } = await params;
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

  const currentUserId = session.user.id || "client-id";
  const currentUserName = session.user.name || "Client Owner";

  const ticket = await db.supportTicket.findUnique({
    where: { id },
    include: { assignedEmployee: true },
  });

  if (!ticket || ticket.clientId !== client.id) {
    notFound();
  }

  const comments = await getComments({ ticketId: ticket.id });

  const statusColors: Record<string, string> = {
    OPEN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-green-500/10 text-green-500 border-green-500/20",
    CLOSED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  const priorityColors: Record<string, string> = {
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CRITICAL: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link 
          href="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Support Desk
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Main Column: Discussion feed */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Ticket Header summary */}
          <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[8px] font-bold px-2 py-0.5 border rounded uppercase tracking-wider ${priorityColors[ticket.priority]}`}>
                {ticket.priority} Priority
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {ticket.category.replace("_", " ")}
              </span>
            </div>

            <h1 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
              {ticket.subject}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-semibold border-t dark:border-slate-900 pt-3 mt-1">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Opened: {new Date(ticket.createdAt).toLocaleDateString("en-IN")}</span>
              <span>•</span>
              <span>Ticket ID: {ticket.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Comment Thread Component */}
          <CommentSection
            ticketId={ticket.id}
            initialComments={comments.map(c => ({
              id: c.id,
              content: c.content,
              userName: c.userName,
              userId: c.userId,
              createdAt: c.createdAt.toISOString(),
            }))}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
          />
        </div>

        {/* Sidebar Info & Controls */}
        <div className="flex flex-col gap-5">
          <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-850 pb-2.5">
              Ticket Details
            </h3>

            {/* Status Info */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Status:</span>
              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 border rounded-lg uppercase tracking-wider ${statusColors[ticket.status]}`}>
                {ticket.status.replace("_", " ")}
              </span>
            </div>

            {/* Assignment Info */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Assigned Agent:</span>
              {ticket.assignedEmployee ? (
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {ticket.assignedEmployee.name}
                </span>
              ) : (
                <span className="text-slate-400 italic">Assigning soon...</span>
              )}
            </div>

            {/* Support SLA notice */}
            <div className="p-3 bg-primary/5 dark:bg-slate-900 border dark:border-slate-850 rounded-xl flex items-start gap-2.5 text-[9px] text-slate-500 leading-normal">
              <LifeBuoy className="h-4 w-4 text-primary shrink-0" />
              <p>Support engineers are actively reviewing details. Most ticket cycles receive comments and resolution within 2-4 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
