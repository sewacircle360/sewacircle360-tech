"use client";

import { useState, useEffect } from "react";
import { getAuditLogs } from "@/modules/admin/actions/dashboard";
import { Activity, ShieldAlert, Clock, User, AlertCircle, Search, Filter } from "lucide-react";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter logs dynamically
  const filteredLogs = logs.filter((log) => {
    // 1. Category Filter
    if (activeCategory !== "ALL") {
      const actionUpper = log.action.toUpperCase();
      if (activeCategory === "AUTH" && !actionUpper.includes("LOGIN") && !actionUpper.includes("PASSWORD")) {
        return false;
      }
      if (activeCategory === "CLIENT" && !actionUpper.includes("CLIENT")) {
        return false;
      }
      if (activeCategory === "AGREEMENT" && !actionUpper.includes("AGREEMENT")) {
        return false;
      }
      if (activeCategory === "STUDENT" && !actionUpper.includes("STUDENT") && !actionUpper.includes("VERIFICATION")) {
        return false;
      }
      if (activeCategory === "SYSTEM" && !actionUpper.includes("SYSTEM") && !actionUpper.includes("CONFIG")) {
        return false;
      }
      if (activeCategory === "EMAIL" && !actionUpper.includes("EMAIL") && !actionUpper.includes("SEND")) {
        return false;
      }
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = log.user?.name?.toLowerCase() || "";
      const email = log.user?.email?.toLowerCase() || "";
      const action = log.action?.toLowerCase() || "";
      const details = log.details?.toLowerCase() || "";
      
      return name.includes(q) || email.includes(q) || action.includes(q) || details.includes(q);
    }

    return true;
  });

  const categories = [
    { id: "ALL", label: "All Logs" },
    { id: "AUTH", label: "Authentication" },
    { id: "CLIENT", label: "Client Profiles" },
    { id: "AGREEMENT", label: "Agreements" },
    { id: "STUDENT", label: "Student Verifications" },
    { id: "EMAIL", label: "Email Alerts" },
    { id: "SYSTEM", label: "System Config" },
  ];

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

      {/* Dynamic Search & Filters controls */}
      <div className="flex flex-col gap-4 bg-white dark:bg-[#090d1f]/60 p-5 border dark:border-slate-800/80 rounded-2xl shadow-sm no-print">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by operator name, email, action type, or trail details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-border/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Categories row */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 font-bold rounded-xl border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-primary text-white border-primary shadow-md scale-[1.02]"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-350 border-border dark:border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-xs text-slate-500">Querying security database...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Logs Found</span>
            <p className="text-xs text-slate-500 mt-1">Try modifying your search query or switching filters.</p>
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
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="py-4 px-6 text-xs text-slate-650 dark:text-slate-350 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-xs uppercase shrink-0">
                          {log.user?.name ? log.user.name.substring(0, 2) : "AD"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{log.user?.name || "System"}</span>
                          <span className="text-[10px] text-slate-450">{log.user?.email || "system@sewacircle360.online"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border uppercase ${
                        log.action.includes("REJECT") ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        log.action.includes("APPROVE") || log.action.includes("CREATE") ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        "bg-primary/10 text-primary border-primary/20"
                      }`}>
                        {log.action}
                      </span>
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
