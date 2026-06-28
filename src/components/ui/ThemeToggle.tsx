"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid hydration mismatch
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 focus:outline-none cursor-pointer border border-transparent hover:border-border"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-500 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
