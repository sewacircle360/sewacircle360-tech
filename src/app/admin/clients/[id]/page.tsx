import { getClientById } from "@/modules/clients/actions/clients";
import { notFound } from "next/navigation";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  ArrowLeft, 
  Briefcase, 
  Receipt, 
  FileCheck2,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Client Profile | SewaCircle360 Business OS",
};

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  const projects = client.projects || [];
  const invoices = client.invoices || [];
  const agreements = client.agreements || [];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2">
        <Link 
          href="/admin/clients"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-foreground rounded-lg transition-colors cursor-pointer"
          aria-label="Back to directory"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Directory</span>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none mt-1">
            {client.companyName}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Detailed Client Metadata */}
        <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b pb-3">Client Contact Info</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Contact Owner</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{client.ownerName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email Address</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white break-all">{client.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Phone Number</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{client.phone || "Not provided"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">GST Registration</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{client.gst || "Unregistered"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Billing Address</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-normal block max-w-xs">
                  {client.address || "No address configured"}
                </span>
                <span className="text-xs text-slate-400 mt-1 block font-medium">{client.country || "Global"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tabular Client Projects & Invoices */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Projects Pipeline */}
          <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 block">
              Active Projects
            </span>
            {projects.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No projects assigned to this client.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                          {proj.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
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

          {/* Billing & Documents vault */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agreements */}
            <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 block">
                Agreements Vault
              </span>
              {agreements.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No agreements drafted yet.</p>
              ) : (
                <div className="space-y-3">
                  {agreements.map((ag) => (
                    <div key={ag.id} className="flex items-center justify-between p-3 border dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {ag.title}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Ref: {ag.agreementNumber}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        ag.status === "SIGNED" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {ag.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Invoices */}
            <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-3 block">
                Invoices Vault
              </span>
              {invoices.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No invoices generated yet.</p>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 border dark:border-slate-850 rounded-xl bg-slate-50/50 dark:bg-slate-950/20">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-[10px] font-extrabold text-primary dark:text-accent mt-0.5">₹{inv.grandTotal.toFixed(2)}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        inv.status === "PAID" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
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
    </div>
  );
}
