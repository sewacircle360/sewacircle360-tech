"use client";

import { useState, useEffect } from "react";
import { getAgreements } from "@/modules/admin/actions/dashboard";
import { FileCheck2, Eye, Calendar, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminAgreementsPage() {
  const [agreements, setAgreements] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getAgreements();
      setAgreements(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Client Agreements
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review legal contracts, verify client e-signatures, and monitor active master service agreements.
        </p>
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
                  <th className="py-4 px-6 text-right">View</th>
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
                        "bg-slate-500/15 text-slate-500 border border-slate-500/20"
                      }`}>
                        {agr.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-650 dark:text-slate-350">
                      {agr.signedAt ? new Date(agr.signedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/portal/agreements/${agr.id}`}
                        className="inline-flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-750 transition-all cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
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
