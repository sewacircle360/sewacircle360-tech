"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";

interface AdminDashboardShellProps {
  role: string;
  name: string | null | undefined;
  children: React.ReactNode;
}

export function AdminDashboardShell({ role, name, children }: AdminDashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar (visible on md+) */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay/drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar container */}
          <div className="relative flex w-64 flex-col bg-slate-900 text-slate-100 h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-4 right-4 z-50">
              <button 
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Sidebar content */}
            <div className="flex-grow h-full overflow-hidden flex">
              <Sidebar isMobileClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border dark:border-slate-800/80 bg-white dark:bg-[#090d1f]/60 backdrop-blur px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white md:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">Workspace</span>
              <span className="text-xs font-bold text-slate-600 dark:text-ccslate-350 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider font-display truncate">
                SewaCircle360 OS
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400">
              Session: <span className="font-bold text-slate-800 dark:text-ccslate-350 capitalize">{role || "Super Admin"}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping hidden sm:block" />
            <ThemeToggle />
          </div>
        </header>

        {/* Scroll Viewport */}
        <main className="flex-grow overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950/40 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
