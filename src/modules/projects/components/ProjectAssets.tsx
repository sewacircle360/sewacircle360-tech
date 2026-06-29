"use client";

import { useState, useTransition } from "react";
import { addProjectAsset, deleteProjectAsset } from "../actions/assets";
import { ExternalLink, Trash2, Loader2, FolderOpen, Link as LinkIcon, PlusCircle } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  url: string;
  category: string;
  date: string;
}

interface ProjectAssetsProps {
  projectId: string;
  initialAssets: Asset[];
  isAdmin?: boolean;
}

const CATEGORIES = ["FIGMA", "GITHUB", "STAGING", "GOOGLE_DRIVE", "DOCUMENT", "OTHER"];

export function ProjectAssets({ projectId, initialAssets = [], isAdmin = false }: ProjectAssetsProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isPending, startTransition] = useTransition();

  // Form states
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("FIGMA");
  const [showAddForm, setShowAddForm] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMsg({ type: "error", text: "Please enter a name." });
      return;
    }
    if (!url.trim()) {
      setMsg({ type: "error", text: "Please enter a valid URL." });
      return;
    }

    startTransition(async () => {
      const result = await addProjectAsset(projectId, name, url, category);
      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else if (result.asset) {
        setAssets(prev => [result.asset as Asset, ...prev]);
        setMsg({ type: "success", text: "Asset added successfully!" });
        setName("");
        setUrl("");
        setShowAddForm(false);
        setTimeout(() => setMsg(null), 2000);
      }
    });
  };

  const handleDeleteAsset = (assetId: string) => {
    if (!confirm("Are you sure you want to remove this link?")) return;

    startTransition(async () => {
      const result = await deleteProjectAsset(projectId, assetId);
      if (result.error) {
        setMsg({ type: "error", text: result.error });
      } else {
        setAssets(prev => prev.filter(a => a.id !== assetId));
        setMsg({ type: "success", text: "Asset removed." });
        setTimeout(() => setMsg(null), 2000);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm p-5 flex flex-col gap-4 text-left">
      <div className="flex justify-between items-center border-b dark:border-slate-850 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FolderOpen className="h-4 w-4 text-primary" /> Deliverables &amp; Assets Drive
        </h3>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[10px] font-bold text-white bg-primary hover:bg-primary/95 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {showAddForm ? "Cancel" : "+ Add Link"}
          </button>
        )}
      </div>

      {msg && (
        <p className={`text-[10px] font-bold ${msg.type === "success" ? "text-green-500" : "text-red-500"}`}>
          {msg.text}
        </p>
      )}

      {/* Add Asset Form */}
      {isAdmin && showAddForm && (
        <form onSubmit={handleAddAsset} className="flex flex-col gap-3 p-3 bg-slate-50 dark:bg-slate-950/40 border dark:border-slate-800/60 rounded-xl">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Asset Name</label>
            <input
              type="text"
              placeholder="e.g. Figma Design System"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">URL Link</label>
            <input
              type="url"
              placeholder="e.g. https://figma.com/file/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isPending}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg outline-none focus:border-primary text-foreground cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-lg disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save Deliverable
          </button>
        </form>
      )}

      {/* Assets List */}
      {assets.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-[10px] text-slate-400">No links shared yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
          {assets.map((asset) => (
            <div key={asset.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/30 border dark:border-slate-850 rounded-xl hover:border-slate-200 dark:hover:border-slate-800 transition-all">
              <a
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group flex-1 min-w-0"
              >
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LinkIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">
                    {asset.name}
                  </span>
                  <span className="text-[8px] font-bold text-slate-450 uppercase tracking-widest mt-0.5">
                    {asset.category.replace("_", " ")}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-450 hover:text-primary rounded-lg transition-colors cursor-pointer"
                  title="Open Link"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    disabled={isPending}
                    className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="Remove Link"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
