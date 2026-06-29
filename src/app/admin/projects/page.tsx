import { getProjects } from "@/modules/projects/actions/projects";
import { Briefcase, Calendar, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Projects Pipeline | SewaCircle360 Business OS",
};

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Projects Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active engineering cycles, development tasks, and delivery milestones.
          </p>
        </div>
        
        <Link 
          href="/admin/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all shadow-sm shadow-primary/10 cursor-pointer w-fit"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Link>
      </div>

      {/* Grid List */}
      {projects.length === 0 ? (
        <div className="py-24 text-center border border-dashed rounded-3xl bg-white dark:bg-slate-900/40">
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            No Active Projects
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
            Initiate a project to assign tasks, define progress milestones, and track deadlines.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const statusColors: Record<string, string> = {
              PLANNING: "bg-blue-500/10 text-blue-500",
              DESIGN: "bg-purple-500/10 text-purple-500",
              DEVELOPMENT: "bg-amber-500/10 text-amber-500",
              TESTING: "bg-cyan-500/10 text-cyan-500",
              DEPLOYMENT: "bg-indigo-500/10 text-indigo-500",
              COMPLETED: "bg-green-500/10 text-green-500",
            };

            // Use slug if available, fallback to id for legacy projects
            const projectHref = project.slug 
              ? `/admin/projects/${project.slug}` 
              : `/admin/projects/${project.id}`;

            return (
              <div 
                key={project.id}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  {/* Status & Deadline */}
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${statusColors[project.status] || "bg-slate-500/10 text-slate-500"}`}>
                      {project.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.deadline 
                        ? new Date(project.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) 
                        : "No Limit"}
                    </span>
                  </div>

                  {/* Project info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display leading-tight line-clamp-1 mb-1">
                      {project.name}
                    </h3>
                    <span className="text-xs text-slate-400 dark:text-slate-400 font-medium block">
                      Client: {project.client.companyName}
                    </span>
                    {project.budget && (
                      <span className="text-xs text-slate-400 dark:text-slate-400 font-medium block">
                        Budget: ₹{project.budget.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar and view details link */}
                <div className="border-t border-border/60 dark:border-slate-800/80 pt-4 mt-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Progress</span>
                    <span className="text-primary dark:text-accent font-extrabold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  
                  <Link
                    href={projectHref}
                    className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent mt-2 pt-2 border-t border-dashed border-border/50 group cursor-pointer"
                  >
                    <span>View Dashboard</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
