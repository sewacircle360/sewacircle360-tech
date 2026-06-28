"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark" storageKey="sewacircle-theme">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
