"use client";

import { useState, useEffect, useTransition } from "react";
import { getClients, createProjectAction } from "@/modules/admin/actions/dashboard";
import { Briefcase, ArrowLeft, Calendar, IndianRupee, Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    startDate: "",
    deadline: "",
    budget: "",
    status: "PLANNING"
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await getClients();
      setClients(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, clientId: data[0].id }));
      }
    }
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.clientId) {
      setError("Project Name and Client are required.");
      return;
    }

    startTransition(async () => {
      const result = await createProjectAction({
        name: formData.name,
        clientId: formData.clientId,
        startDate: formData.startDate || undefined,
        deadline: formData.deadline || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        status: formData.status
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Project created!");
        setTimeout(() => {
          // Redirect to slug URL if available, else projects list
          const slug = (result as any).slug || (result as any).project?.slug;
          router.push(slug ? `/admin/projects/${slug}` : "/admin/projects");
        }, 1200);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
            Create Project
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Initialize a new commercial workspace and assign it to a client profile.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Name *</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-450" />
              <input
                type="text"
                placeholder="Enterprise Cloud Architecture"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isPending}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
              />
            </div>
          </div>

          {/* Client Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assign Client *</label>
            <div className="relative">
              <Users className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-450" />
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                disabled={isPending || clients.length === 0}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all appearance-none"
              >
                {clients.length === 0 ? (
                  <option value="">No clients found - Add clients first</option>
                ) : (
                  clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.ownerName})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-450" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-450" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Budget (INR ₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-3 h-4 w-4 text-slate-450" />
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>

            {/* Initial Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Initial Project Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all appearance-none"
              >
                <option value="PLANNING">Planning</option>
                <option value="DESIGN">Design</option>
                <option value="DEVELOPMENT">Development</option>
                <option value="TESTING">Testing</option>
                <option value="DEPLOYMENT">Deployment</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Feedback */}
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/85">
            <Link
              href="/admin/projects"
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 dark:bg-slate-900 border rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending || clients.length === 0}
              className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Launch Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
