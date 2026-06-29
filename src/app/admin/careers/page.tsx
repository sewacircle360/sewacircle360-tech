"use client";

import { useState, useEffect, useTransition } from "react";
import { createJobPosition, getJobPositions, deleteJobPosition } from "@/modules/careers/actions/careers";
import { Briefcase, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, MapPin, Clock } from "lucide-react";

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
    description: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchJobs = async () => {
    const list = await getJobPositions();
    setJobs(list);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.description) {
      setError("Title and description are required fields.");
      return;
    }

    startTransition(async () => {
      const result = await createJobPosition(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Position published!");
        setFormData({
          title: "",
          department: "Engineering",
          location: "Remote (India)",
          type: "Full-time",
          description: ""
        });
        fetchJobs();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this job position?")) return;
    const result = await deleteJobPosition(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchJobs();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Careers Manager
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Publish and remove open job postings on the public careers directory page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-4 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Publish New Position</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Senior Full-Stack Engineer"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-border rounded-xl outline-none text-foreground cursor-pointer focus:border-primary"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={isPending}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-border rounded-xl outline-none text-foreground cursor-pointer focus:border-primary"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</label>
              <input 
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Remote (India) or Punjab, India"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</label>
              <textarea 
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter role responsibilities and required skill sets..."
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
              Publish Job opening
            </button>
          </form>
        </div>

        {/* Right Openings list */}
        <div className="lg:col-span-8 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          {jobs.length === 0 ? (
            <div className="py-16 text-center">
              <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-650 mx-auto mb-2" />
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Job Openings</span>
              <p className="text-xs text-slate-500 mt-1">Publish positions to list them on the public careers portal.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</span>
                          <span className="text-xs text-slate-450 line-clamp-1 max-w-xs">{job.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{job.department}</td>
                      <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{job.location}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide bg-blue-500/10 text-blue-500">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete position"
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
