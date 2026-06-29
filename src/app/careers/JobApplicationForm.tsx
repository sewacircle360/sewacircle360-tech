"use client";

import { useState, useTransition } from "react";
import { createLeadAction } from "@/modules/crm/actions/leads";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function JobApplicationForm({ selectedRole }: { selectedRole: string }) {
  const [formData, setFormData] = useState({ name: "", email: "", details: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email) {
      setError("Please fill out all required fields.");
      return;
    }

    startTransition(async () => {
      // Re-use Lead creation actions for job applications
      const result = await createLeadAction({
        name: formData.name,
        email: formData.email,
        service: `Job Application: ${selectedRole || "General Application"}`,
        budget: "Careers",
        timeline: "Immediate",
        message: formData.details
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Application received successfully! Our team will contact you after reviewing your details.");
        setFormData({ name: "", email: "", details: "" });
      }
    });
  };

  return (
    <div id="apply-form" className="max-w-2xl mx-auto px-4 sm:px-6 mt-16 text-left">
      <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-lg backdrop-blur-sm">
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">Submit Application</h2>
        <p className="text-xs text-slate-500 mb-6">
          Apply for the position of: <span className="font-semibold text-primary dark:text-accent">{selectedRole || "General Applicant"}</span>
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-4 text-center py-6">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Application Received!</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                {success}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Deepak Bawa"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address *</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="deepak@sewacircle360tech.online"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Introduce Yourself</label>
              <textarea 
                rows={4}
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Tell us about your background, links to your portfolio/GitHub, and why you want to build with us..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all duration-300 disabled:opacity-75 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
