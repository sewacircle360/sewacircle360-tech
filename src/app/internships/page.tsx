"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function InternshipsRedirectPage() {
  useEffect(() => {
    redirect("/talent-network");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Redirecting to SewaCircle360 Talent Network...</p>
      </div>
    </div>
  );
}
