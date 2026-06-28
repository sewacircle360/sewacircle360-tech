"use client";

import { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

const JOBS = [
  {
    title: "Senior Full-Stack Engineer (Next.js & Node.js)",
    department: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
    description: "Architect high-performance Next.js portals and MongoDB databases. Build scalable CRM and CMS pipelines."
  },
  {
    title: "UI/UX Product Designer",
    department: "Design",
    location: "Remote (India)",
    type: "Full-time",
    description: "Design sleek, glassmorphic client dashboards and modern landing pages with strict grid and typography constraints."
  },
  {
    title: "Technical Project Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Manage client deliverables, organize task backlogs, coordinate developer milestones, and structure product scopes."
  }
];

export default function CareersPage() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "", details: "" });
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return;

    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", role: "", details: "" });
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs tracking-wider uppercase mb-4"
          >
            <Sparkles className="h-3 w-3" /> Join Our Team
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-6 leading-tight">
            Build the Future of Enterprise Software
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are looking for creators, thinkers, and builders to help us develop next-generation corporate operating systems and premium SaaS ecosystems.
          </p>
        </div>

        {/* Listings Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-24 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-2">Open Opportunities</h2>
          <div className="flex flex-col gap-5">
            {JOBS.map((job, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-ccslate-850 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-xs text-ccslate-550 dark:text-ccslate-450 leading-relaxed max-w-xl">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setFormData({ ...formData, role: job.title })}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 md:self-center"
                >
                  Apply Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div id="apply-form" className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-ccslate-850 p-8 rounded-3xl shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">Submit Application</h2>
            <p className="text-xs text-slate-500 mb-6">Complete the details below, and our recruitment team will get back to you shortly.</p>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-center py-6"
              >
                <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Application Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                    Thank you for applying. We will review your submission and contact you within 3-5 business days.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Deepak Bawa"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="deepak@sewacircle360tech.online"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Desired Role</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Introduce Yourself</label>
                  <textarea 
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Tell us about your background, experience, and why you want to build with us..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400 resize-none"
                  />
                </div>

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
      </main>
      <Footer />
    </>
  );
}
