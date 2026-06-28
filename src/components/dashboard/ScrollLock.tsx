"use client";

import { useEffect } from "react";

export function ScrollLock() {
  useEffect(() => {
    // Capture original scroll styles
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    // Force hide outer browser scrollbars
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      // Restore original scroll settings when component unmounts
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return null;
}
