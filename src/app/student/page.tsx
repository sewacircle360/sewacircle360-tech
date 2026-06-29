import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { GraduationCap, Award, BookOpen, Clock, CheckCircle2, ChevronRight, Bookmark } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Student Dashboard | SewaCircle360 Hub",
};

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect("/auth/login");
  }

  const email = session.user.email;

  // Query student requests and internship applications from the database
  const projectRequests = await db.studentProjectRequest.findMany({
    where: { studentEmail: email },
    orderBy: { createdAt: "desc" }
  });

  const internshipApplications = await db.lead.findMany({
    where: { email: email, service: "Internship Application" },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Student Workspace
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your active academic project requests and track your internship applications.
        </p>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Requests</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-display leading-none">
              {projectRequests.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#090d1f]/60 p-5 rounded-2xl border dark:border-slate-800/80 shadow-sm flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Internship Actions</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-display leading-none">
              {internshipApplications.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Project Mentorship requests */}
        <div className="lg:col-span-7 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Academic Project Mentorship
            </span>
            <Link href="/student-training" className="text-xs text-primary dark:text-accent font-semibold hover:underline flex items-center">
              New Request <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>

          {projectRequests.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <Bookmark className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400">No project training requests submitted yet.</p>
              <Link href="/student-training" className="text-xs font-bold text-primary dark:text-accent hover:underline mt-1">
                Apply for academic guidance
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {projectRequests.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                        {req.projectTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Submitted on {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      req.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                      req.status === "APPROVED" ? "bg-blue-500/10 text-blue-500" :
                      req.status === "IN_PROGRESS" ? "bg-indigo-500/10 text-indigo-500" :
                      "bg-green-500/10 text-green-500"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Internship applications list */}
        <div className="lg:col-span-5 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internship Applications
            </span>
            <Link href="/internships" className="text-xs text-primary dark:text-accent font-semibold hover:underline flex items-center">
              Apply Now <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>

          {internshipApplications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <Award className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400">No internship applications submitted yet.</p>
              <Link href="/internships" className="text-xs font-bold text-primary dark:text-accent hover:underline mt-1">
                Apply for internship positions
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {internshipApplications.map((app) => (
                <div key={app.id} className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                        Software Developer Intern
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      app.status === "NEW" ? "bg-blue-500/10 text-blue-500" :
                      app.status === "QUALIFIED" ? "bg-green-500/10 text-green-500" :
                      app.status === "LOST" ? "bg-red-500/10 text-red-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      {app.status === "NEW" ? "Submitted" : app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
