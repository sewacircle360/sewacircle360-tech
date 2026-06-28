"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const logoHeights = {
    sm: "h-5",
    md: "h-7",
    lg: "h-11",
  };

  return (
    <Link 
      href="/" 
      className={`flex items-center justify-center bg-slate-950/5 dark:bg-white/5 hover:bg-slate-950/10 dark:hover:bg-white/10 p-1.5 px-3.5 rounded-full border border-slate-200/60 dark:border-slate-800/40 transition-all duration-300 hover:scale-102 shrink-0 ${className}`}
    >
      <img 
        src="/logo.png" 
        alt="SewaCircle360 Tech Logo"
        className={`${logoHeights[size]} w-auto object-contain`} 
      />
    </Link>
  );
}
