"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

const REVENUE_DATA = [
  { month: "Jan", revenue: 4000, leads: 24 },
  { month: "Feb", revenue: 5500, leads: 38 },
  { month: "Mar", revenue: 7800, leads: 56 },
  { month: "Apr", revenue: 6200, leads: 42 },
  { month: "May", revenue: 9500, leads: 70 },
  { month: "Jun", revenue: 12000, leads: 95 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Revenue growth Area Chart */}
      <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="mb-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Revenue Performance
          </h4>
          <span className="text-2xl font-extrabold font-display text-slate-800 dark:text-white mt-1 block">
            ₹12,000.00
          </span>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads pipeline Bar Chart */}
      <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
        <div className="mb-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            CRM Leads Pipeline
          </h4>
          <span className="text-2xl font-extrabold font-display text-slate-800 dark:text-white mt-1 block">
            95 Active
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
              <Bar dataKey="leads" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
