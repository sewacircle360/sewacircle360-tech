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

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

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

    // Dynamic Lists queries
    const activeProjectsList = await db.project.findMany({
      where: {
        OR: [
          { developerIds: { has: userId } },
          { designerIds: { has: userId } },
          { managerId: userId }
        ],
        status: { not: "COMPLETED" }
      },
      take: 5,
      orderBy: { createdAt: "desc" }
    }).catch(() => []);

    const activeTasksList = await db.task.findMany({
      where: {
        assignedToId: userId,
        status: { not: "COMPLETED" }
      },
      take: 5,
      orderBy: { dueDate: "asc" }
    }).catch(() => []);

    const upcomingMeetingsList = await db.meeting.findMany({
      where: {
        assignedEmployeeId: userId,
        preferredDate: { gte: startOfToday }
      },
      take: 5,
      orderBy: { preferredDate: "asc" }
    }).catch(() => []);

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

        {/* Dynamic Lists Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Projects & Tasks */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Active Projects Progress */}
            <div className="bg-white dark:bg-[#090d1f]/60 p-5 border dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 dark:border-slate-800 pb-3 block">
                Your Active Projects
              </span>
              {activeProjectsList.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No active projects assigned to you.</p>
              ) : (
                <div className="space-y-4">
                  {activeProjectsList.map((proj) => (
                    <div key={proj.id} className="flex flex-col gap-1.5 border border-slate-100 dark:border-slate-800/60 p-3.5 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{proj.name}</span>
                        <span className="text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${proj.progress}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 shrink-0">{proj.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Task List */}
            <div className="bg-white dark:bg-[#090d1f]/60 p-5 border dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 dark:border-slate-800 pb-3 block">
                Pending Tasks
              </span>
              {activeTasksList.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No pending tasks assigned.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-2.5">Task Title</th>
                        <th className="py-2.5">Due Date</th>
                        <th className="py-2.5 text-right">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                      {activeTasksList.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-900/5 transition-colors">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{task.title}</td>
                          <td className="py-3 text-slate-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                          <td className="py-3 text-right">
                            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded uppercase ${
                              task.priority === "URGENT" || task.priority === "HIGH" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                              task.priority === "MEDIUM" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                              "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Meetings */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#090d1f]/60 p-5 border dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-border/60 dark:border-slate-800 pb-3 block">
                Upcoming Meetings
              </span>
              {upcomingMeetingsList.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No upcoming meetings scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingMeetingsList.map((meet) => (
                    <div key={meet.id} className="border border-slate-100 dark:border-slate-800/60 p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{meet.name}</span>
                      <div className="flex flex-col gap-0.5 text-[10px] text-slate-500 font-semibold mt-1">
                        <span>Date: {new Date(meet.preferredDate).toLocaleDateString()}</span>
                        <span>Time: {meet.preferredTime} ({meet.timezone})</span>
                        <span className="text-primary mt-1 text-[9px] uppercase tracking-wider">{meet.meetingType}</span>
                      </div>
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

  // 1. Query real-time metrics

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
