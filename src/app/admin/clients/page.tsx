import { getClients, deleteClient } from "@/modules/clients/actions/clients";
import { Users, Mail, Phone, Globe, Trash2, ArrowUpRight, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Clients Directory | SewaCircle360 Business OS",
};

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Clients Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Store contact records and manage client portal access accounts.
          </p>
        </div>
        
        <Link 
          href="/admin/clients/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm shadow-primary/10 cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          Add New Client
        </Link>
      </div>

      {/* Table container */}
      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              No Clients Found
            </span>
            <p className="text-xs text-slate-550 dark:text-slate-400 max-w-xs mx-auto mt-2">
              Register clients to generate invoices, assign milestones, and setup portal credentials.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Contact Owner</th>
                  <th className="py-4 px-6">Active Projects</th>
                  <th className="py-4 px-6 text-center">Portal Access</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-850/60">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {client.companyName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {client.country || "Global"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5 text-slate-650 dark:text-slate-300">
                        <span className="text-sm font-semibold">{client.ownerName}</span>
                        <span className="text-xs text-slate-400">{client.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-350">
                        {client._count?.projects || 0} Projects
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {client.userId ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-green-500/10 text-green-500">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-300/10 text-slate-400">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-foreground rounded-lg transition-colors cursor-pointer"
                          aria-label="View Client details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
