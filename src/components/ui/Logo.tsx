"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const logoHeights = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-11 w-11",
  };

  const textSizes = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-lg sm:text-xl",
  };

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-2.5 bg-slate-900/[0.04] dark:bg-white/[0.04] hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.08] p-1.5 px-3 rounded-full border border-slate-200/60 dark:border-slate-800/40 transition-all duration-300 hover:scale-102 shrink-0 ${className}`}
    >
      {/* Premium Circular Tech Emblem Image */}
      <img 
        src="/logo.png" 
        alt="SewaCircle360 Tech Logo"
        className={`${logoHeights[size]} rounded-full object-cover shrink-0`} 
      />

      {showText && (
        <span className={`${textSizes[size]} font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-1 shrink-0`}>
          <span>SewaCircle360</span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-black">Tech</span>
        </span>
      )}
    </Link>
  );
}
