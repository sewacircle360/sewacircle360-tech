"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { createLeadAction } from "@/modules/crm/actions/leads";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Terminal, 
  Layers, 
  Users, 
  Award, 
  CheckCircle, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

const BENEFITS = [
  {
    icon: Terminal,
    title: "Hands-on Projects",
    desc: "Work on active agency client codebases. Learn Git workflows, pull requests, and standard code reviews."
  },
  {
    icon: Layers,
    title: "Modern Tech Training",
    desc: "Get practical experience in Next.js 16, Tailwind CSS, TypeScript, MongoDB Atlas, Node containers, and Prisma."
  },
  {
    icon: Users,
    title: "Team Mentorship",
    desc: "Regular pair-programming calls and code optimization syncs with experienced senior engineers."
  },
  {
    icon: Award,
    title: "Experience Certificate",
    desc: "Earn a certificate and letters of recommendation upon successful completion of your internship tenure."
  }
];

export default function InternshipsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    collegeName: "",
    message: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.collegeName) {
      setError("Please fill out all required fields.");
      return;
    }

    startTransition(async () => {
      // Re-use Lead creation actions for internship applications
      const result = await createLeadAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        companyName: formData.collegeName,
        service: "Internship Application",
        budget: "Internship",
        timeline: "Immediate",
        message: formData.message
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Application submitted successfully! Our recruitment team will review your profile and contact you.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          collegeName: "",
          message: ""
        });
      }
    });
  };

  return (
    <>
      <title>Software Engineering Internships | SewaCircle360</title>
      <meta name="description" content="Apply for hands-on software developer remote internships and get mentored on live enterprise software solutions." />
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs tracking-wider uppercase mb-4">
            <Sparkles className="h-4 w-4" /> Start Your Career
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-6 leading-tight max-w-3xl mx-auto">
            SewaCircle360 Internship Program
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Gain professional experience by building software systems alongside our development team. We offer remote internships with dedicated tech mentorship.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4"
              >
                <div className="p-3 bg-primary/5 dark:bg-accent/5 text-primary dark:text-accent rounded-xl w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">Submit Internship Application</h2>
            <p className="text-xs text-slate-500 mb-6">Complete the brief form below. Tell us about your tech interests and upload/link your GitHub profile.</p>

            {success ? (
              <div className="flex flex-col items-center gap-4 text-center py-6">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                  <CheckCircle className="h-10 w-10" />
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
                      placeholder="Enter Full Name"
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
                      placeholder="name@email.com"
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">College / Institute *</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      placeholder="e.g. LPU, Thapar, PEC"
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Introduction, GitHub, & Portfolio Links</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide your GitHub link and tell us about projects you have worked on..."
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
                    <span>Apply for Internship</span>
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
