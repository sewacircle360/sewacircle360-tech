"use client";

import { useState } from "react";
import { Layers, Palette } from "lucide-react";

interface SettingsTabsProps {
  pageBuilder: React.ReactNode;
  brandingCustomizer: React.ReactNode;
}

export function SettingsTabs({ pageBuilder, brandingCustomizer }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<"cms" | "branding">("cms");

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs list */}
      <div className="flex border-b dark:border-slate-850 no-print">
        <button
          type="button"
          onClick={() => setActiveTab("cms")}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "cms"
              ? "border-primary text-primary dark:text-accent dark:border-accent"
              : "border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-white"
          }`}
        >
          <Layers className="h-4 w-4" /> Website CMS Builder
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "branding"
              ? "border-primary text-primary dark:text-accent dark:border-accent"
              : "border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-white"
          }`}
        >
          <Palette className="h-4 w-4" /> Corporate & PDF Customizer
        </button>
      </div>

      {/* Panels */}
      <div>
        {activeTab === "cms" ? pageBuilder : brandingCustomizer}
      </div>
    </div>
  );
}
