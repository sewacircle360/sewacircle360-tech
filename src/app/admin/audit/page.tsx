"use client";

import { useState, useEffect } from "react";
import { getAuditLogs } from "@/modules/admin/actions/dashboard";
import { Activity, ShieldAlert, Clock, User, AlertCircle } from "lucide-react";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getAuditLogs();
      setLogs(data);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Security Audit Trails
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review real-time operation history, database mutations, and administrative logins.
        </p>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Logs Found</span>
            <p className="text-xs text-slate-500 mt-1">System activity logs are currently clean and empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Operator</th>
                  <th className="py-4 px-6">Action / Event</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6 text-xs text-slate-650 dark:text-slate-350 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{log.user.name}</span>
                          <span className="text-[10px] text-slate-450">{log.user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-primary dark:text-accent">
                      {log.action}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-650 dark:text-slate-350 font-mono">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-450 font-medium">
                      {log.details}
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
