"use client";

import { useState, useEffect } from "react";
import { Sparkles, Palette, ShieldCheck, Check, Building2, Save } from "lucide-react";

interface BrandingConfig {
  brandColor: string;
  brandName: string;
  executiveLeadership: string;
  companyAddress: string;
  companyEmail: string;
  gstNumber: string;
  digitalSeal: string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  brandColor: "#2563eb",
  brandName: "SewaCircle360 TECHNOLOGY",
  executiveLeadership: "Deepak Bawa (Founder) & Riya Garg (Co-Founder)",
  companyAddress: "Phase 7, Mohali, Punjab",
  companyEmail: "contact@sewacircle360.online",
  gstNumber: "03SEWAC360T1Z2",
  digitalSeal: "CIRCULAR_BLUE",
};

export function BrandingCustomizer() {
  const [config, setConfig] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("brandingSettings");
    if (saved) {
      try {
        setConfig({ ...DEFAULT_BRANDING, ...JSON.parse(saved) });
      } catch (err) {
        console.error("Failed to parse branding config:", err);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("brandingSettings", JSON.stringify(config));
    
    // Trigger custom event so any active viewers can reload settings
    window.dispatchEvent(new Event("brandingChanged"));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const presetColors = [
    { name: "Royal Blue", hex: "#2563eb" },
    { name: "Cyan Spark", hex: "#0891b2" },
    { name: "Forest Emerald", hex: "#059669" },
    { name: "Royal Purple", hex: "#7c3aed" },
    { name: "Premium Slate", hex: "#1e293b" },
    { name: "Crimson Red", hex: "#dc2626" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
      {/* Editor Form Panel */}
      <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-5 bg-white dark:bg-[#090d1f]/60 p-6 sm:p-8 border dark:border-slate-800/80 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2 pb-4 border-b dark:border-slate-850">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Branding Configuration</h2>
        </div>

        {/* Brand details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand Name</label>
            <input
              type="text"
              required
              value={config.brandName}
              onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Executive Leadership</label>
            <input
              type="text"
              required
              value={config.executiveLeadership}
              onChange={(e) => setConfig({ ...config, executiveLeadership: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Address</label>
            <input
              type="text"
              required
              value={config.companyAddress}
              onChange={(e) => setConfig({ ...config, companyAddress: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">GSTIN / Tax ID</label>
            <input
              type="text"
              required
              value={config.gstNumber}
              onChange={(e) => setConfig({ ...config, gstNumber: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-border/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Color Customizer */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary PDF theme color</label>
          <div className="flex flex-wrap gap-2.5 items-center">
            {presetColors.map((color) => (
              <button
                type="button"
                key={color.hex}
                onClick={() => setConfig({ ...config, brandColor: color.hex })}
                className="w-8 h-8 rounded-full border-2 cursor-pointer transition-all flex items-center justify-center shadow"
                style={{ 
                  backgroundColor: color.hex,
                  borderColor: config.brandColor === color.hex ? "#ffffff" : "transparent",
                  boxShadow: config.brandColor === color.hex ? `0 0 0 2px ${color.hex}` : "none"
                }}
                title={color.name}
              >
                {config.brandColor === color.hex && <Check className="h-4 w-4 text-white" />}
              </button>
            ))}
            <input
              type="color"
              value={config.brandColor}
              onChange={(e) => setConfig({ ...config, brandColor: e.target.value })}
              className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-transparent p-0 cursor-pointer overflow-hidden"
              title="Custom Hex Picker"
            />
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
              {config.brandColor}
            </span>
          </div>
        </div>

        {/* Digital Seal stamp selection */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Corporate seal style</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "CIRCULAR_BLUE", label: "Official Circular Stamp", desc: "Circular gradient security seal" },
              { id: "VERIFIED_BADGE", label: "Verified Security Badge", desc: "Digital authorization checkmark badge" },
              { id: "RED_STAMP", label: "Approved Corporate Stamp", desc: "Square red stamp of verification" },
              { id: "NONE", label: "No Seal", desc: "Do not render any stamp on PDFs" },
            ].map((seal) => (
              <button
                type="button"
                key={seal.id}
                onClick={() => setConfig({ ...config, digitalSeal: seal.id })}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                  config.digitalSeal === seal.id
                    ? "bg-slate-50 dark:bg-slate-900 border-primary dark:border-accent ring-2 ring-primary/10 dark:ring-accent/10"
                    : "bg-transparent border-border dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                }`}
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white">{seal.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">{seal.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all duration-300 cursor-pointer mt-2"
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4" /> Branding Saved Successfully!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Branding Preferences
            </>
          )}
        </button>
      </form>

      {/* Live Preview Box */}
      <div className="lg:col-span-5 bg-white dark:bg-[#090d1f]/60 p-6 border dark:border-slate-800/80 rounded-3xl shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b dark:border-slate-850">
          <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Live PDF Document Preview</h2>
        </div>

        {/* Simulated Document Sheet */}
        <div className="bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 rounded-2xl p-5 aspect-[1/1.3] shadow-inner relative flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start border-b dark:border-slate-850 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="h-4 w-1 inline-block rounded-full" style={{ backgroundColor: config.brandColor }} />
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider truncate max-w-[130px]">
                {config.brandName || "BRAND NAME"}
              </span>
            </div>
            <div className="flex flex-col text-right items-end">
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: config.brandColor }}>
                TAX INVOICE
              </span>
              <span className="text-[7px] font-mono text-slate-500 font-bold">#INV-2026-001</span>
            </div>
          </div>

          {/* Details */}
          <div className="my-3 space-y-2 flex-grow text-left">
            <div className="space-y-0.5 text-[8px] text-slate-500">
              <p className="font-bold text-slate-900 dark:text-white">Bill To:</p>
              <p>Acme Corp Ltd</p>
              <p>{config.companyAddress || "Mohali, Punjab"}</p>
              <p>GSTIN: {config.gstNumber || "03SEWAC360T1Z2"}</p>
            </div>

            {/* Line items simulator */}
            <div className="mt-4 border-t border-b dark:border-slate-850 py-2">
              <div className="flex justify-between text-[7px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Description</span>
                <span>Total</span>
              </div>
              <div className="flex justify-between text-[8px] font-semibold text-slate-900 dark:text-white mt-1">
                <span>Software License Fee</span>
                <span>₹1,50,000.00</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature with Seal */}
          <div className="border-t dark:border-slate-850 pt-3 flex justify-between items-end">
            <div className="space-y-0.5 text-[7px] text-slate-500 text-left">
              <p className="font-bold text-slate-900 dark:text-white">Signature Block</p>
              <p className="font-medium text-[6px]">{config.executiveLeadership || "Deepak Bawa"}</p>
            </div>

            {/* Digital Seal Seal Display inside live preview */}
            <div className="h-14 w-14 shrink-0 flex items-center justify-center">
              {config.digitalSeal === "CIRCULAR_BLUE" && (
                <svg width="48" height="48" viewBox="0 0 100 100" style={{ color: config.brandColor }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
                  <polygon points="50,28 53,38 63,38 55,44 58,54 50,48 42,54 45,44 37,38 47,38" fill="currentColor" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              )}
              {config.digitalSeal === "VERIFIED_BADGE" && (
                <div className="p-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex flex-col items-center gap-0.5 shadow-sm">
                  <ShieldCheck className="h-6 w-6" style={{ color: config.brandColor }} />
                  <span className="text-[5px] font-black uppercase text-slate-500 tracking-wider">VERIFIED</span>
                </div>
              )}
              {config.digitalSeal === "RED_STAMP" && (
                <div className="border-2 border-red-500 text-red-500 font-black text-[7px] p-1.5 uppercase rounded tracking-widest rotate-12 select-none">
                  APPROVED
                </div>
              )}
              {config.digitalSeal === "NONE" && (
                <span className="text-[7px] text-slate-400 italic">No Seal</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
