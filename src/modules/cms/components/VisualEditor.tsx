"use client";

import { useState, useTransition } from "react";
import { savePageSections } from "../actions/pages";
import { Save, ArrowUp, ArrowDown, Settings, Edit3, Check, Loader2, RefreshCw } from "lucide-react";

interface Section {
  id: string;
  type: string;
  order: number;
  content: any;
}

interface VisualEditorProps {
  pageId: string;
  initialSections: Section[];
}

export function VisualEditor({ pageId, initialSections }: VisualEditorProps) {
  const [sections, setSections] = useState<Section[]>(
    initialSections.sort((a, b) => a.order - b.order)
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reorder sections
  const handleMove = (idx: number, direction: "up" | "down") => {
    const nextIdx = direction === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= sections.length) return;

    const updated = [...sections];
    // Swap items
    const temp = updated[idx];
    updated[idx] = updated[nextIdx];
    updated[nextIdx] = temp;

    // Recalculate orders
    const ordered = updated.map((sec, i) => ({
      ...sec,
      order: i + 1
    }));

    setSections(ordered);
    setSuccess(null);
  };

  // Modify section content fields
  const handleContentChange = (idx: number, key: string, value: any) => {
    setSections(prev => prev.map((sec, i) => {
      if (i === idx) {
        return {
          ...sec,
          content: {
            ...sec.content,
            [key]: value
          }
        };
      }
      return sec;
    }));
    setSuccess(null);
  };

  const handleSave = () => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await savePageSections(
          pageId,
          sections.map(s => ({ type: s.type, order: s.order, content: s.content }))
        );

        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("Page builder sections saved successfully!");
        }
      } catch (err) {
        setError("An error occurred while saving page sections.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor list */}
      <div className="lg:col-span-8 space-y-6">
        {sections.map((sec, idx) => (
          <div 
            key={sec.id || idx}
            className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-5 shadow-sm relative"
          >
            {/* Section Card Header */}
            <div className="flex justify-between items-center border-b border-border/60 dark:border-slate-800/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-primary/10 text-primary dark:text-accent px-2 py-0.5 rounded">
                  ORDER: {sec.order}
                </span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
                  {sec.type} Section
                </h3>
              </div>

              {/* Order togglers */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0 || isPending}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 rounded cursor-pointer"
                  aria-label="Move Section Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === sections.length - 1 || isPending}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 rounded cursor-pointer"
                  aria-label="Move Section Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Custom Inputs per section type */}
            <div className="space-y-4">
              {sec.type === "HERO" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Headline</label>
                    <input
                      type="text"
                      value={sec.content.headline || ""}
                      onChange={(e) => handleContentChange(idx, "headline", e.target.value)}
                      disabled={isPending}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Description</label>
                    <textarea
                      rows={3}
                      value={sec.content.description || ""}
                      onChange={(e) => handleContentChange(idx, "description", e.target.value)}
                      disabled={isPending}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg outline-none focus:border-primary text-foreground resize-none"
                    />
                  </div>
                </>
              )}

              {sec.type === "CTA" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">CTA Headline</label>
                    <input
                      type="text"
                      value={sec.content.headline || ""}
                      onChange={(e) => handleContentChange(idx, "headline", e.target.value)}
                      disabled={isPending}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">CTA Description</label>
                    <textarea
                      rows={2}
                      value={sec.content.description || ""}
                      onChange={(e) => handleContentChange(idx, "description", e.target.value)}
                      disabled={isPending}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border rounded-lg outline-none focus:border-primary text-foreground resize-none"
                    />
                  </div>
                </>
              )}

              {sec.type !== "HERO" && sec.type !== "CTA" && (
                <p className="text-xs text-slate-400 italic">
                  This section ({sec.type}) holds dynamic layout grid details compiled on the database level.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Settings control panel */}
      <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col gap-5 lg:sticky lg:top-24">
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-border/80 pb-3 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Publish Config
        </span>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Clicking save updates the sections order and layout configurations for the live public website instantly.
        </p>

        {/* Feedbacks */}
        {error && (
          <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2 font-medium">
            <Check className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-75 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Publish Web Layout
            </>
          )}
        </button>
      </div>
    </div>
  );
}
