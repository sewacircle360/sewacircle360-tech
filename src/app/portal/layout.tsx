import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getClientByUserId } from "@/modules/clients/actions/clients";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FolderCheck, Receipt, FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
 
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
 
  if (!session || !session.user?.id) {
    redirect("/auth/login");
  }
 
  const userId = session.user.id;
  const userName = session.user.name || "Preview Owner";
  const userEmail = session.user.email || "preview@client.com";
 
  // Fetch client profile linked to the logged-in user
  let client: any = await getClientByUserId(userId);
 
  // Admin portal preview fallback to avoid blocking developers/super-admins
  if (!client && (session.user as any).role === "SUPER_ADMIN") {
    // Check if we can map a temporary mock client
    const existingClient = await db.client.findFirst();
    if (existingClient) {
      client = existingClient;
    } else {
      // Create a simulated client
      client = {
        id: "mock-client-id",
        companyName: "Simulated Client Corp",
        ownerName: userName,
        email: userEmail,
        phone: null,
        address: null,
        gst: null,
        country: "Preview",
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }
 
  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="glass-card border rounded-2xl p-8 max-w-sm text-center flex flex-col items-center gap-4">
          <span className="text-sm font-bold text-red-500 uppercase tracking-wider">Access Denied</span>
          <p className="text-xs text-slate-500">Your account is not linked to a Client profile. Contact the system administrator.</p>
          <Link href="/auth/login" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Portal Header */}
      <header className="h-16 fixed top-0 left-0 right-0 z-40 border-b border-border dark:border-slate-800/80 bg-white dark:bg-[#090d1f]/60 backdrop-blur px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Logo showText={false} size="sm" />
          <span className="w-px h-6 bg-border dark:bg-slate-800 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Client Portal</span>
            <span className="text-xs font-semibold text-slate-500">/</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
              {client.companyName}
            </span>
          </div>
        </div>
 
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="text-xs font-semibold text-slate-550 dark:text-slate-400 hidden md:block">
            {client.ownerName}
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
 
      {/* Viewport content */}
      <div className="flex-grow pt-16 flex flex-col">
        {/* Navigation row specifically for portal sections */}
        <div className="bg-white dark:bg-[#090d1f]/35 border-b border-border/80 dark:border-slate-850 px-6 py-2.5 flex gap-5 overflow-x-auto">
          <Link href="/portal" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-primary dark:text-slate-300 dark:hover:text-accent transition-colors">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <Link href="/portal" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-primary dark:text-slate-300 dark:hover:text-accent transition-colors">
            <FolderCheck className="h-3.5 w-3.5" />
            Projects
          </Link>
          <Link href="/portal/profile" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-primary dark:text-slate-300 dark:hover:text-accent transition-colors">
            <User className="h-3.5 w-3.5" />
            Profile Settings
          </Link>
        </div>

        {/* Inner children view */}
        <div className="p-6 flex-grow max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
