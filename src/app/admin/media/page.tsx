"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Search, Link as LinkIcon, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState([
    { id: "1", name: "sewacircle360-logo.png", type: "image/png", size: "45 KB", url: "/logo.svg" },
    { id: "2", name: "hero-background.jpg", type: "image/jpeg", size: "1.2 MB", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" },
    { id: "3", name: "student-contract-template.pdf", type: "application/pdf", size: "320 KB", url: "#" },
    { id: "4", name: "blog-react-v16.jpg", type: "image/jpeg", size: "680 KB", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
  ]);

  const handleDelete = (id: string) => {
    setMediaItems(mediaItems.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Media Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Store and manage company files, static images, and document templates.
          </p>
        </div>
        <button
          onClick={() => alert("Upload media using standard drag-and-drop or select file!")}
          className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer border-0"
        >
          <Plus className="h-4 w-4" /> Upload Asset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-primary/45 transition-all duration-300"
          >
            {/* Asset preview container */}
            <div className="aspect-video w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden">
              {item.type.startsWith("image/") ? (
                <img src={item.url} alt={item.name} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              ) : (
                <FileText className="h-10 w-10 text-primary/45" />
              )}
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-slate-450 font-mono block truncate">{item.type}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display mt-0.5 truncate" title={item.name}>
                  {item.name}
                </h4>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/85 pt-3">
                <span className="text-[10px] text-slate-500 font-semibold">{item.size}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      alert("Asset URL copied to clipboard!");
                    }}
                    title="Copy direct URL"
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete asset"
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer border-0 bg-transparent"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
