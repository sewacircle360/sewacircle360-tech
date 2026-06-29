import { db } from "@/lib/db";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { 
  Target, 
  Users, 
  Briefcase, 
  Receipt, 
  Plus, 
  FileText, 
  FileCheck2,
  Calendar,
  Layers,
  ArrowUpRight,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export const metadata = {
  title: "Dashboard | SewaCircle360 Business OS",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  const userId = session?.user?.id;
  const isEmployee = userRole === "EMPLOYEE";

  if (isEmployee && userId) {
    const employeeProjectsCount = await db.project.count({
      where: {
        OR: [
          { developerIds: { has: userId } },
          { designerIds: { has: userId } },
          { managerId: userId }
        ]
      }
    }).catch(() => 0);

    const employeeTasksCount = await db.task.count({
      where: { assignedToId: userId }
    }).catch(() => 0);

    const employeeMeetingsCount = await db.meeting.count({
      where: { assignedEmployeeId: userId }
    }).catch(() => 0);

    const quickActions = [
      { label: "My Profile", href: "/admin/profile", icon: Users, color: "text-blue-500" },
      { label: "Meetings Calendar", href: "/admin/meetings", icon: Calendar, color: "text-emerald-500" },
      { label: "Projects Pipeline", href: "/admin/projects", icon: Briefcase, color: "text-cyan-500" },
    ];

    return (
      <div className="flex flex-col gap-6 text-left">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Employee Workspace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {session?.user?.name || "Team Member"}. Track your assigned projects, tasks, and meetings.
          </p>
        </div>

        {/* Stats Counter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Projects */}
          <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Projects</span>
              <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{employeeProjectsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</span>
              <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{employeeTasksCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>

          {/* Meetings */}
          <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Meetings</span>
              <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{employeeMeetingsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Quick Action matrix */}
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block">
            Workspace Quick Actions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((act) => {
              const Icon = act.icon;
              return (
                <Link 
                  key={act.label}
                  href={act.href}
                  className="flex flex-col items-center justify-center text-center p-4 rounded-xl border dark:border-slate-800 hover:border-primary/20 dark:hover:border-accent/20 bg-slate-50 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900 transition-all duration-300 gap-2 cursor-pointer group"
                >
                  <div className={`p-2.5 bg-white dark:bg-slate-950 border rounded-lg group-hover:scale-105 transition-transform ${act.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {act.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 1. Query real-time metrics
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayLeadsCount = await db.lead.count({
    where: { createdAt: { gte: startOfToday } }
  }).catch(() => 0);

  const clientsCount = await db.client.count().catch(() => 0);
  
  const projectsCount = await db.project.count({
    where: { status: { not: "COMPLETED" } }
  }).catch(() => 0);

  const pendingBillsCount = await db.invoice.count({
    where: { status: { in: ["UNPAID", "OVERDUE"] } }
  }).catch(() => 0);

  // 2. Calculate Total Paid Revenue sum
  const paidInvoices = await db.invoice.findMany({
    where: { status: "PAID" },
    select: { grandTotal: true }
  }).catch(() => []);
  const totalPaidRevenue = paidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  // 3. Aggregate Monthly Analytics for Recharts
  const currentYear = new Date().getFullYear();
  const yearlyInvoices = await db.invoice.findMany({
    where: {
      status: "PAID",
      createdAt: { gte: new Date(currentYear, 0, 1) }
    },
    select: { grandTotal: true, createdAt: true }
  }).catch(() => []);

  const yearlyLeads = await db.lead.findMany({
    where: {
      createdAt: { gte: new Date(currentYear, 0, 1) }
    },
    select: { createdAt: true }
  }).catch(() => []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();

  const monthlyStats = months.slice(0, Math.max(6, currentMonthIdx + 1)).map((m, idx) => {
    const monthInvoices = yearlyInvoices.filter(inv => inv.createdAt.getMonth() === idx);
    const revSum = monthInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const monthLeadsCount = yearlyLeads.filter(l => l.createdAt.getMonth() === idx).length;

    return {
      month: m,
      revenue: revSum,
      leads: monthLeadsCount
    };
  });

  const totalLeadsCount = await db.lead.count().catch(() => 0);

  const quickActions = [
    { label: "Add Client", href: "/admin/clients/new", icon: Users, color: "text-blue-500" },
    { label: "New Project", href: "/admin/projects/new", icon: Briefcase, color: "text-emerald-500" },
    { label: "Generate Invoice", href: "/admin/invoices/new", icon: Receipt, color: "text-cyan-500" },
    { label: "Draft Agreement", href: "/admin/agreements/new", icon: FileCheck2, color: "text-indigo-500" },
    { label: "New Product", href: "/admin/products/new", icon: Layers, color: "text-purple-500" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Operational Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor CRM pipelines, generate documents, and track active client delivery milestones.
        </p>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Leads */}
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Leads</span>
            <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{todayLeadsCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Target className="h-5 w-5" />
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Clients</span>
            <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{clientsCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Projects</span>
            <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{projectsCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Bills</span>
            <span className="text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-none">{pendingBillsCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Receipt className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Quick Action matrix */}
      <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block">
          OS Quick Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <Link 
                key={act.label}
                href={act.href}
                className="flex flex-col items-center justify-center text-center p-4 rounded-xl border dark:border-slate-800 hover:border-primary/20 dark:hover:border-accent/20 bg-slate-50 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900 transition-all duration-300 gap-2 cursor-pointer group"
              >
                <div className={`p-2.5 bg-white dark:bg-slate-950 border rounded-lg group-hover:scale-105 transition-transform ${act.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {act.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recharts Analytics Panel */}
      <DashboardCharts 
        totalPaidRevenue={totalPaidRevenue} 
        totalLeadsCount={totalLeadsCount} 
        monthlyStats={monthlyStats} 
      />
    </div>
  );
}
