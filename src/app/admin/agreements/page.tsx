"use client";

import { useState, useEffect, useTransition } from "react";
import { getAgreements, sendAgreementEmailAction } from "@/modules/admin/actions/dashboard";
import { FileCheck2, Eye, Calendar, UserCheck, Plus, Send } from "lucide-react";
import Link from "next/link";

export default function AdminAgreementsPage() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadAgreements = async () => {
    const data = await getAgreements();
    setAgreements(data);
  };

  useEffect(() => {
    loadAgreements();
  }, []);

  const handleSendEmail = (agreementId: string) => {
    if (!confirm("Are you sure you want to email this agreement to the client?")) return;
    startTransition(async () => {
      const res = await sendAgreementEmailAction(agreementId);
      if (res.error) {
        alert(res.error);
      } else {
        alert(res.success || "Agreement sent!");
        loadAgreements();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Client Agreements
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review legal contracts, verify client e-signatures, and monitor active master service agreements.
          </p>
        </div>
        <Link
          href="/admin/agreements/new"
          className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create Agreement
        </Link>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {agreements.length === 0 ? (
          <div className="py-16 text-center">
            <FileCheck2 className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Agreements Found</span>
            <p className="text-xs text-slate-500 mt-1">Contracts are auto-generated when quotations are accepted by clients.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Agreement ID</th>
                  <th className="py-4 px-6">Document Title</th>
                  <th className="py-4 px-6">Client Profile</th>
                  <th className="py-4 px-6">Sign Status</th>
                  <th className="py-4 px-6">Signature Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                {agreements.map((agr) => (
                  <tr key={agr.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {agr.agreementNumber}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {agr.title}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{agr.client.companyName}</span>
                        <span className="text-xs text-slate-450">{agr.client.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        agr.status === "SIGNED" ? "bg-green-500/15 text-green-500 border border-green-500/20" :
                        agr.status === "DRAFT" ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" :
                        "bg-slate-500/15 text-slate-500 border border-slate-500/20"
                      }`}>
                        {agr.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-650 dark:text-slate-350">
                      {agr.signedAt ? new Date(agr.signedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Link
                          href={`/portal/agreements/${agr.id}`}
                          target="_blank"
                          className="inline-flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-750 transition-all cursor-pointer"
                          title="View SLA Review Sheet"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {agr.status === "DRAFT" && (
                          <button
                            onClick={() => handleSendEmail(agr.id)}
                            disabled={isPending}
                            className="inline-flex p-1.5 hover:bg-primary/10 rounded-lg text-slate-400 hover:text-primary transition-all cursor-pointer bg-transparent border-0 disabled:opacity-50"
                            title="Email to Client"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
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
