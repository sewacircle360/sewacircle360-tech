"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { createStudentProjectRequest } from "@/modules/projects/actions/student-requests";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Terminal, 
  Code2, 
  Settings, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  Loader2, 
  BookOpen, 
  AlertCircle
} from "lucide-react";

const BENEFITS = [
  {
    icon: Code2,
    title: "1-on-1 Guidance",
    desc: "We don't just build it for you. We teach you the logic, structure, and libraries step-by-step so you actually learn how it works."
  },
  {
    icon: Terminal,
    title: "Modern Tech Stack",
    desc: "Train on standard production libraries including Next.js, Tailwind CSS, TypeScript, MongoDB, and Prisma."
  },
  {
    icon: Settings,
    title: "Architecture Design",
    desc: "Learn to model clean databases, write robust Zod validation schemas, and structure modular server components."
  },
  {
    icon: UserCheck,
    title: "Deployment & Reviews",
    desc: "Deploy your final project live on Vercel or Render. Get comprehensive code reviews to understand optimizations."
  }
];

export default function StudentTrainingPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    collegeName: "",
    projectTitle: "",
    description: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.studentName || !formData.studentEmail || !formData.collegeName || !formData.projectTitle || !formData.description) {
      setError("Please fill out all fields.");
      return;
    }

    startTransition(async () => {
      const result = await createStudentProjectRequest(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Submitted successfully!");
        setFormData({
          studentName: "",
          studentEmail: "",
          collegeName: "",
          projectTitle: "",
          description: ""
        });
      }
    });
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        
        {/* Hero Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs tracking-wider uppercase mb-4">
            <GraduationCap className="h-4 w-4" /> Academic Project Guidance
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-6 leading-tight max-w-3xl mx-auto">
            Don't Just Submit a Project. Learn to Build It.
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We provide full mentorship and architectural training for your final year or semester college projects. We guide you through planning, coding, database modeling, and live deployment.
          </p>
        </div>

        {/* Benefits Grid */}
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

        {/* Form & Info Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-tight">
              Academic Mentoring Program Details
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Our engineering team helps computer science and IT students bridge the gap between academic theories and professional production standards. We help you design real-world applications that impress external examiners.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Full Documentation Support</h4>
                  <p className="text-xs text-slate-400 mt-0.5">We help you write structured project reports, SRS documentation, and architecture diagrams.</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Flexible Schedules</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Sessions are scheduled in evenings and weekends to accommodate your regular college classes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">Request Project Training</h2>
            <p className="text-xs text-slate-500 mb-6">Tell us about your project requirements and target tech stack. We will structure a syllabus and timeline for you.</p>

            {success ? (
              <div className="flex flex-col items-center gap-4 text-center py-6">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Request Submitted!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                    {success}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="Your Name"
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.studentEmail}
                      onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                      placeholder="name@college.edu"
                      disabled={isPending}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">College / University Name</label>
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Proposed Project Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    placeholder="e.g. AI Coding Helper, School ERP"
                    disabled={isPending}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Description & Requirements</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about the project rules, syllabus guidelines, and any specific modules you need to implement..."
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
                      Submitting Request...
                    </>
                  ) : (
                    <span>Submit Mentorship Request</span>
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
