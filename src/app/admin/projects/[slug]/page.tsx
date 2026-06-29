import { getProjectBySlugOrId } from "@/modules/projects/actions/projects";
import { notFound } from "next/navigation";
import { 
  Calendar, Clock, Receipt, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { ProjectActions } from "@/modules/projects/components/ProjectActions";
import { ProjectExpenses } from "@/modules/projects/components/ProjectExpenses";
import { ProjectAssets } from "@/modules/projects/components/ProjectAssets";
import { auth } from "@/auth";
import { getComments } from "@/modules/comments/actions/comments";
import { CommentSection } from "@/modules/comments/components/CommentSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);
  return {
    title: project ? `${project.name} | SewaCircle360 OS` : "Project Not Found",
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id || "admin-id";
  const currentUserName = session?.user?.name || "Admin/Manager";

  // getProjectBySlugOrId tries slug first, then falls back to ID lookup
  const project = await getProjectBySlugOrId(slug);

  if (!project) notFound();

  const comments = await getComments({ projectId: project.id });

  const statusColors: Record<string, string> = {
    PLANNING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    DESIGN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    DEVELOPMENT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    TESTING: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    DEPLOYMENT: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    COMPLETED: "bg-green-500/10 text-green-500 border-green-500/20",
    MAINTENANCE: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const taskStatusColors: Record<string, string> = {
    TODO: "bg-slate-500/10 text-slate-500",
    IN_PROGRESS: "bg-blue-500/10 text-blue-500",
    REVIEW: "bg-amber-500/10 text-amber-500",
    DONE: "bg-green-500/10 text-green-500",
  };

  const totalInvoiced = project.invoices?.reduce((sum, inv) => sum + inv.grandTotal, 0) || 0;
  const totalPaid = project.invoices?.filter(i => i.status === "PAID").reduce((sum, inv) => sum + inv.grandTotal, 0) || 0;
  const totalPending = totalInvoiced - totalPaid;

  const totalExpenses = project.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const netMargin = (project.budget || 0) - totalExpenses;

  const doneTasks = project.tasks.filter(t => t.status === "DONE").length;
  const totalTasks = project.tasks.length;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/admin/projects" className="hover:text-primary transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
              {project.name}
            </h1>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${statusColors[project.status] || "bg-slate-500/10 text-slate-500"}`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Client: <span className="font-semibold text-slate-700 dark:text-slate-200">{project.client.companyName}</span>
            {project.deadline && (
              <> &nbsp;·&nbsp; Deadline: <span className="font-semibold text-slate-700 dark:text-slate-200">{new Date(project.deadline).toLocaleDateString("en-IN")}</span></>
            )}
            {project.budget && (
              <> &nbsp;·&nbsp; Budget: <span className="font-semibold text-slate-700 dark:text-slate-200">₹{project.budget.toLocaleString("en-IN")}</span></>
            )}
          </p>
          {project.slug && (
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <LinkIcon className="h-3 w-3" /> /admin/projects/{project.slug}
            </p>
          )}
        </div>

        <Link
          href={`/admin/invoices/new?clientId=${project.clientId}&projectId=${project.id}`}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl cursor-pointer shrink-0 w-fit"
        >
          <Receipt className="h-3.5 w-3.5" /> Add Invoice
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Progress</span>
          <span className="text-2xl font-black text-primary dark:text-accent">{project.progress}%</span>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks Done</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{doneTasks}<span className="text-sm text-slate-400 font-normal">/{totalTasks}</span></span>
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount Paid</span>
          <span className="text-xl font-black text-green-500">₹{totalPaid.toLocaleString("en-IN")}</span>
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Invoice</span>
          <span className="text-xl font-black text-amber-500">₹{totalPending.toLocaleString("en-IN")}</span>
        </div>
        <div className="bg-white dark:bg-[#090d1f]/60 p-4 rounded-2xl border dark:border-slate-800/80 shadow-sm flex flex-col gap-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profit Margin</span>
          <span className={`text-xl font-black ${netMargin >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            ₹{netMargin.toLocaleString("en-IN")}
          </span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Budget: ₹{(project.budget || 0).toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Tasks</h2>
              <span className="text-xs font-bold text-slate-400">{doneTasks}/{totalTasks} completed</span>
            </div>
            {project.tasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-slate-400">No tasks created yet.</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-slate-800">
                {project.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 gap-3">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className={`font-semibold text-sm text-slate-900 dark:text-white truncate ${task.status === "DONE" ? "line-through opacity-60" : ""}`}>
                        {task.title}
                      </span>
                      {task.assignedTo && (
                        <span className="text-[10px] text-slate-400">Assigned: {task.assignedTo.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {task.dueDate && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${taskStatusColors[task.status] || "bg-slate-500/10 text-slate-500"}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Milestones</h2>
            </div>
            {project.milestones.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No milestones yet.</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-slate-800">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-4">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === "COMPLETED" ? "bg-green-500" : m.status === "IN_PROGRESS" ? "bg-amber-500" : "bg-slate-400"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold text-slate-900 dark:text-white truncate ${m.status === "COMPLETED" ? "line-through opacity-60" : ""}`}>
                        {m.title}
                      </p>
                      {m.dueDate && (
                        <p className="text-[10px] text-slate-400">{new Date(m.dueDate).toLocaleDateString("en-IN")}</p>
                      )}
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      m.status === "COMPLETED" ? "bg-green-500/10 text-green-500" :
                      m.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500" :
                      "bg-slate-500/10 text-slate-500"
                    }`}>
                      {m.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5">
            <ProjectExpenses
              projectId={project.id}
              initialExpenses={project.expenses.map((e: any) => ({
                id: e.id,
                amount: e.amount,
                category: e.category,
                description: e.description,
                date: e.date.toISOString(),
              }))}
            />
          </div>

          <div className="mt-5">
            <CommentSection
              projectId={project.id}
              initialComments={comments.map((c: any) => ({
                id: c.id,
                content: c.content,
                userName: c.userName,
                userId: c.userId,
                createdAt: c.createdAt.toISOString(),
              }))}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          </div>
        </div>

        {/* Sidebar: Controls + Invoices */}
        <div className="flex flex-col gap-5">
          {/* Interactive Controls (client component) */}
          <ProjectActions
            projectId={project.id}
            currentStatus={project.status}
            currentProgress={project.progress}
            projectSlug={project.slug || null}
          />

          {/* Project Assets / Links Drive */}
          <ProjectAssets
            projectId={project.id}
            initialAssets={Array.isArray(project.assets) ? (project.assets as any) : []}
            isAdmin={true}
          />

          {/* Linked Invoices */}
          <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Invoices</h2>
              <Link href={`/admin/invoices/new?clientId=${project.clientId}&projectId=${project.id}`} className="text-[10px] text-primary font-bold hover:underline">
                + Add
              </Link>
            </div>
            {!project.invoices || project.invoices.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No invoices linked yet.</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-slate-800">
                {project.invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</p>
                      <p className="text-[10px] text-slate-400">₹{inv.grandTotal.toLocaleString("en-IN")}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      inv.status === "PAID" ? "bg-green-500/10 text-green-500" :
                      inv.status === "OVERDUE" ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
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
  );
}
