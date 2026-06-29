"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortfolioProject, getPortfolioProjects, deletePortfolioProject } from "@/modules/portfolio/actions/portfolio";
import { FolderGit, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, Globe } from "lucide-react";

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Website Development",
    description: "",
    technologiesText: "",
    liveUrl: "",
    coverUrl: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchProjects = async () => {
    const list = await getPortfolioProjects();
    setProjects(list);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.slug || !formData.description) {
      setError("Name, slug, and description are required.");
      return;
    }

    const technologies = formData.technologiesText
      ? formData.technologiesText.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const coverUrl = formData.coverUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

    startTransition(async () => {
      const result = await createPortfolioProject({
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        description: formData.description,
        technologies,
        liveUrl: formData.liveUrl || undefined,
        coverUrl,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Portfolio project created successfully!");
        setFormData({
          name: "",
          slug: "",
          category: "Website Development",
          description: "",
          technologiesText: "",
          liveUrl: "",
          coverUrl: ""
        });
        fetchProjects();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this case study?")) return;
    const result = await deletePortfolioProject(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchProjects();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Portfolio Grid CMS
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage dynamic case studies and projects listed on the public portfolio grid page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Add Form */}
        <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Add Case Study</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Name</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E-Commerce Operating System"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</label>
                <input 
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="ecommerce-os"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                <input 
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Web App & CRM"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Technologies (comma-separated)</label>
              <input 
                type="text"
                value={formData.technologiesText}
                onChange={(e) => setFormData({ ...formData, technologiesText: e.target.value })}
                placeholder="Next.js, Tailwind CSS, Prisma"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live URL</label>
              <input 
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://shop.sewacircle360tech.online"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cover Image URL</label>
              <input 
                type="url"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Description</label>
              <textarea 
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Designed a premium storefront using Next.js..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Publish Case Study
            </button>
          </form>
        </div>

        {/* Right Side Projects grid */}
        <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          {projects.length === 0 ? (
            <div className="py-16 text-center">
              <FolderGit className="h-8 w-8 text-slate-350 mx-auto mb-2" />
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Custom Projects</span>
              <p className="text-xs text-slate-500 mt-1">Default portfolio case studies are hardcoded. Added projects will show next to them with live links.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Project Name</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Technologies</th>
                    <th className="py-4 px-6">Live URL</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex flex-col gap-0.5">
                          <span>{proj.name}</span>
                          <span className="text-xs text-slate-450 font-normal line-clamp-1 max-w-xs">{proj.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{proj.category}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {proj.technologies?.map((tech: string, tIdx: number) => (
                            <span key={tIdx} className="text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500">
                        {proj.liveUrl ? (
                          <a href={proj.liveUrl} target="_blank" className="text-primary hover:underline flex items-center gap-1 font-semibold">
                            Live <Globe className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
