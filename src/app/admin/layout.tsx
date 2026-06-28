import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Double layer route protection in Server Component
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden scroll-lock-root bg-slate-100 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation Panel */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border dark:border-slate-800/80 bg-white dark:bg-[#090d1f]/60 backdrop-blur px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Workspace</span>
            <span className="text-xs font-bold text-slate-600 dark:text-ccslate-350">/</span>
            <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display">
              SewaCircle360 OS
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Session: <span className="font-bold text-slate-800 dark:text-ccslate-350 capitalize">{(session.user as any).role || "Super Admin"}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          </div>
        </header>

        {/* Content Scroll Grid */}
        <main className="flex-grow overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/40 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
