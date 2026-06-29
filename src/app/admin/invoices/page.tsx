"use client";

import { useState, useEffect } from "react";
import { getInvoices } from "@/modules/admin/actions/dashboard";
import { Receipt, Plus, Eye, DollarSign, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getInvoices();
      setInvoices(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Invoices & Billings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track business revenue, issue corporate billings, and check client receipt statuses.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Create Invoice
        </Link>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Invoices Found</span>
            <p className="text-xs text-slate-500 mt-1">Generate a new billing invoice to start tracking revenue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Invoice Number</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Grand Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{inv.client.companyName}</span>
                        <span className="text-xs text-slate-450">{inv.client.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-650 dark:text-slate-350">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white">
                      ${inv.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        inv.status === "PAID" ? "bg-green-500/15 text-green-500 border border-green-500/20" :
                        inv.status === "OVERDUE" ? "bg-red-500/15 text-red-500 border border-red-500/20" :
                        "bg-slate-500/15 text-slate-500 border border-slate-500/20"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
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
