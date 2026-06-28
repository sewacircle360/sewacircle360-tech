import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getClientByUserId } from "@/modules/clients/actions/clients";
import { db } from "@/lib/db";
import { 
  Briefcase, 
  Receipt, 
  FileCheck2, 
  ExternalLink, 
  Calendar,
  CheckCircle,
  FileSignature
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Client Workspace | SewaCircle360 Portal",
};

export default async function ClientPortalPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/auth/login");
  }

  // Fetch client details
  let client = await getClientByUserId(session.user.id);

  // Fallback preview for Admin users
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

  // Double fetch details just to ensure everything is resolved
  const details = await db.client.findUnique({
    where: { id: client.id },
    include: {
      projects: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
      agreements: { orderBy: { createdAt: "desc" } },
    }
  });

  const projects = details?.projects || [];
  const invoices = details?.invoices || [];
  const agreements = details?.agreements || [];

  // Summary counts
  const activeProjects = projects.filter(p => p.status !== "COMPLETED").length;
  const unpaidInvoices = invoices.filter(i => i.status === "UNPAID").length;
  const signedAgreements = agreements.filter(a => a.status === "SIGNED").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Welcome back, {client.ownerName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review active milestones, access invoices, and execute pending agreements.
        </p>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Projects</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-display leading-none">{activeProjects}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Bills</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-display leading-none">{unpaidInvoices}</span>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 border">
            <Receipt className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed Agreements</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-display leading-none">{signedAgreements}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border">
            <FileCheck2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Projects block */}
        <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 block">
            Project Deliverables & Timelines
          </span>

          {projects.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No projects assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                        {proj.name}
                      </h4>
                      <span className="text-[10px] text-ccslate-450 uppercase font-semibold">
                        Status: {proj.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : "Flexible"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Progress</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent" 
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Vault: Invoices & Agreements lists */}
        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          {/* Agreements Box */}
          <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 block">
              Agreements Vault
            </span>

            {agreements.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No contracts uploaded.</p>
            ) : (
              <div className="space-y-3">
                {agreements.map((ag) => (
                  <div key={ag.id} className="flex items-center justify-between p-3 border dark:border-ccslate-850 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-ccslate-850 dark:text-slate-200 truncate">
                        {ag.title}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5">Ref: {ag.agreementNumber}</span>
                    </div>

                    {ag.status === "SIGNED" ? (
                      <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 shrink-0">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Signed
                      </span>
                    ) : (
                      <Link 
                        href={`/portal/agreements/${ag.id}`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-primary px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                      >
                        <FileSignature className="h-3.5 w-3.5" />
                        Sign
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoices Box */}
          <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 block">
              Invoices & Billing
            </span>

            {invoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No billing records generated.</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 border dark:border-ccslate-850 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-ccslate-850 dark:text-slate-200">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-[10px] font-extrabold text-primary dark:text-accent mt-0.5">₹{inv.grandTotal.toFixed(2)}</span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      inv.status === "PAID" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
