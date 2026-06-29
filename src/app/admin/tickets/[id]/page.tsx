import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getComments } from "@/modules/comments/actions/comments";
import { CommentSection } from "@/modules/comments/components/CommentSection";
import { TicketStatusActions } from "@/modules/tickets/components/TicketStatusActions";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminTicketDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const currentUserId = session.user.id || "admin-id";
  const currentUserName = `${session.user.name || "Admin"} (Admin)`;

  const ticket = await db.supportTicket.findUnique({
    where: { id },
    include: { client: true, assignedEmployee: true },
  });

  if (!ticket) {
    notFound();
  }

  const comments = await getComments({ ticketId: ticket.id });

  // Retrieve administrators and employees for ticket assignments
  const teamMembers = await db.user.findMany({
    where: {
      role: {
        name: { in: ["EMPLOYEE", "SUPER_ADMIN", "ADMIN"] }
      }
    },
    select: { id: true, name: true }
  });

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
      {/* Back button */}
      <div>
        <Link 
          href="/admin/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tickets Center
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Column */}
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
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Opened: {new Date(ticket.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span>•</span>
              <span>Ticket ID: {ticket.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Chat thread comments */}
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

        {/* Sidebar Info & Actions */}
        <div className="flex flex-col gap-5">
          {/* Status actions component */}
          <TicketStatusActions
            ticketId={ticket.id}
            currentStatus={ticket.status}
            currentAssignedId={ticket.assignedEmployeeId}
            employees={teamMembers}
          />

          {/* Client Details Widget */}
          <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b dark:border-slate-850 pb-2.5">
              Client Profile
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Company</span>
                <span className="font-bold text-slate-850 dark:text-slate-100">{ticket.client.companyName}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Contact Person</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.client.ownerName}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 pt-1.5 border-t dark:border-slate-900">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="font-medium truncate">{ticket.client.email}</span>
              </div>

              {ticket.client.phone && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="font-medium">{ticket.client.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
