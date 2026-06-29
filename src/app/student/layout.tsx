import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LayoutDashboard, GraduationCap, Award, LogOut, User } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const role = (session.user as any).role;
  if (role !== "STUDENT" && role !== "SUPER_ADMIN" && role !== "ADMIN") {
    redirect("/auth/login");
  }

  const dbUser = await db.user.findUnique({ where: { id: session.user.id } });
  if (dbUser?.mustChangePassword) {
    redirect("/auth/change-password");
  }

  const name = session.user.name || "Student";
  const email = session.user.email || "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Student Header */}
      <header className="h-16 fixed top-0 left-0 right-0 z-40 border-b border-border dark:border-slate-800/80 bg-white dark:bg-[#090d1f]/60 backdrop-blur px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Logo showText={false} size="sm" />
          <span className="w-px h-6 bg-border dark:bg-slate-800 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Student Portal</span>
            <span className="text-xs font-semibold text-slate-500">/</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-primary" /> {dbUser?.collegeName || "Academic Hub"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden md:block">
            {name}
          </div>
          <Link 
            href="/api/auth/signout"
            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="flex-grow pt-16 flex flex-col">
        {/* Navigation tabs */}
        <div className="bg-white dark:bg-[#090d1f]/35 border-b border-border/80 dark:border-slate-800/60 px-6 py-2.5 flex gap-5 overflow-x-auto">
          <Link href="/student" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-accent transition-colors">
            <LayoutDashboard className="h-3.5 w-3.5" />
            My Dashboard
          </Link>
          <Link href="/student-training" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-accent transition-colors">
            <GraduationCap className="h-3.5 w-3.5" />
            Apply Training
          </Link>
          <Link href="/internships" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-accent transition-colors">
            <Award className="h-3.5 w-3.5" />
            Apply Internships
          </Link>
        </div>

        {/* Page children */}
        <div className="p-6 flex-grow max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>

    </div>
  );
}
