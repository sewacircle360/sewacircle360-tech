"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const logoHeights = {
    sm: "h-6",
    md: "h-9",
    lg: "h-14",
  };

  return (
    <Link href="/" className={`flex items-center focus:outline-none ${className}`}>
      <img 
        src="/logo.png" 
        alt="SewaCircle360 Tech Logo"
        className={`${logoHeights[size]} w-auto object-contain transition-transform duration-300 hover:scale-102`} 
      />
    </Link>
  );
}
