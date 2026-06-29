import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getClientByUserId } from "@/modules/clients/actions/clients";
import { db } from "@/lib/db";
import { 
  Briefcase, 
  Receipt, 
  FileCheck2, 
  Calendar,
  CheckCircle,
  FileSignature,
  TrendingUp,
  IndianRupee,
  Clock,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { SteppedProgress } from "@/modules/projects/components/SteppedProgress";
import { ProjectAssets } from "@/modules/projects/components/ProjectAssets";
import { getComments } from "@/modules/comments/actions/comments";
import { CommentSection } from "@/modules/comments/components/CommentSection";

export const metadata = {
  title: "Client Workspace | SewaCircle360 Portal",
};

export default async function ClientPortalPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/auth/login");
  }

  const currentUserId = session.user.id || "client-id";
  const currentUserName = session.user.name || "Client Owner";

  let client = await getClientByUserId(session.user.id);

  if (!client && (session.user as any).role === "SUPER_ADMIN") {
    client = await db.client.findFirst({
      include: {
        projects: true,
        invoices: true,
        agreements: true,
        tickets: true
      }
    });
  }

  if (!client) {
    redirect("/auth/login");
  }

  const details = await db.client.findUnique({
    where: { id: client.id },
    include: {
      projects: { 
        orderBy: { createdAt: "desc" },
        include: {
          invoices: { orderBy: { createdAt: "desc" } }
        }
      },
      invoices: { 
        orderBy: { createdAt: "desc" },
        where: { projectId: null } // Show non-project invoices separately
      },
      agreements: { orderBy: { createdAt: "desc" } },
    }
  });

  const rawProjects = details?.projects || [];
  const projects = await Promise.all(
    rawProjects.map(async (p) => {
      const comments = await getComments({ projectId: p.id });
      return { ...p, comments };
    })
  );
  const standaloneInvoices = details?.invoices || [];
  const agreements = details?.agreements || [];

  // Overall billing summary across all invoices
  const allInvoices = [...standaloneInvoices, ...projects.flatMap(p => p.invoices)];
  const totalBilled = allInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPaid = allInvoices.filter(i => i.status === "PAID").reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalPending = totalBilled - totalPaid;

  const activeProjects = projects.filter(p => p.status !== "COMPLETED").length;
  const signedAgreements = agreements.filter(a => a.status === "SIGNED").length;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Welcome banner */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Welcome back, {client.ownerName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {client.companyName} · Review your active projects, payments, and agreements.
        </p>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Projects</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-display leading-none">{activeProjects}</span>
          <Briefcase className="h-4 w-4 text-blue-500 mt-1" />
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Billed</span>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white font-display leading-none">₹{totalBilled.toLocaleString("en-IN")}</span>
          <IndianRupee className="h-4 w-4 text-primary mt-1" />
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount Paid</span>
          <span className="text-lg font-extrabold text-green-500 font-display leading-none">₹{totalPaid.toLocaleString("en-IN")}</span>
          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
          <span className="text-lg font-extrabold text-amber-500 font-display leading-none">₹{totalPending.toLocaleString("en-IN")}</span>
          <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Projects with payment breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Deliverables & Payment Status
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-slate-400">No projects assigned yet.</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-slate-800">
                {projects.map((proj) => {
                  const projPaid = proj.invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.grandTotal, 0);
                  const projTotal = proj.invoices.reduce((s, i) => s + i.grandTotal, 0);
                  const projPending = projTotal - projPaid;

                  return (
                    <div key={proj.id} className="p-5 flex flex-col gap-4">
                      {/* Project Header */}
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">{proj.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              proj.status === "COMPLETED" ? "bg-green-500/10 text-green-500" :
                              proj.status === "DEVELOPMENT" ? "bg-amber-500/10 text-amber-500" :
                              "bg-blue-500/10 text-blue-500"
                            }`}>
                              {proj.status}
                            </span>
                            {proj.deadline && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(proj.deadline).toLocaleDateString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Payment Summary Badges */}
                        {projTotal > 0 && (
                          <div className="flex gap-2 text-[10px] font-bold flex-wrap">
                            <span className="px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg border border-green-500/20">
                              Paid: ₹{projPaid.toLocaleString("en-IN")}
                            </span>
                            {projPending > 0 && (
                              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20">
                                Due: ₹{projPending.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Interactive Stepped Progress Timeline */}
                      <div className="border-t border-dashed dark:border-slate-800/80 pt-4 mt-2">
                        <SteppedProgress status={proj.status} />
                      </div>

                      {/* Numeric Progress Bar */}
                      <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-950/30 p-4 border dark:border-slate-800/50 rounded-2xl">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Incremental Build Progress</span>
                          <span className="text-primary dark:text-accent font-extrabold">{proj.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700" 
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Shared Project Assets Drive */}
                      <div className="mt-1">
                        <ProjectAssets
                          projectId={proj.id}
                          initialAssets={Array.isArray(proj.assets) ? (proj.assets as any) : []}
                          isAdmin={false}
                        />
                      </div>

                      {/* Linked Invoice rows */}
                      {proj.invoices.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoices</span>
                          {proj.invoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border dark:border-slate-800">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</span>
                                <span className="text-slate-400 text-[10px]">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700 dark:text-slate-200">₹{inv.grandTotal.toLocaleString("en-IN")}</span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                  inv.status === "PAID" ? "bg-green-500/10 text-green-500" :
                                  inv.status === "OVERDUE" ? "bg-red-500/10 text-red-500" :
                                  "bg-amber-500/10 text-amber-500"
                                }`}>
                                  {inv.status}
                                </span>
                                <Link href={`/portal/invoices/${inv.id}`} className="text-[9px] text-primary font-bold hover:underline">View</Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Project Discussion Board */}
                      <div className="mt-4 border-t border-dashed dark:border-slate-800/80 pt-4">
                        <CommentSection
                          projectId={proj.id}
                          initialComments={proj.comments.map((c: any) => ({
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Agreements + Standalone Invoices */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Agreements */}
          <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Agreements</span>
            </div>
            {agreements.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No contracts uploaded.</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-slate-800">
                {agreements.map((ag) => (
                  <div key={ag.id} className="flex items-center justify-between p-3.5 gap-2">
                    <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{ag.title}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Ref: {ag.agreementNumber}</span>
                    </div>
                    {ag.status === "SIGNED" ? (
                      <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 shrink-0">
                        <CheckCircle className="h-3.5 w-3.5" /> Signed
                      </span>
                    ) : (
                      <Link 
                        href={`/portal/agreements/${ag.id}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-primary px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                      >
                        <FileSignature className="h-3 w-3" /> Sign
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Standalone Invoices (not project-linked) */}
          {standaloneInvoices.length > 0 && (
            <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Other Invoices</span>
              </div>
              <div className="divide-y dark:divide-slate-800">
                {standaloneInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</span>
                      <span className="text-[10px] font-bold text-primary dark:text-accent">₹{inv.grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      inv.status === "PAID" ? "bg-green-500/10 text-green-500" :
                      inv.status === "OVERDUE" ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
