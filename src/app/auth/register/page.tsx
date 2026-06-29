"use client";

import { useState, useTransition } from "react";
import { registerStudentAction } from "@/modules/auth/actions/register";
import { GraduationCap, Mail, Lock, User, School, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", collegeName: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.collegeName || !formData.password) {
      setError("Please fill in all registration fields.");
      return;
    }

    startTransition(async () => {
      const result = await registerStudentAction({
        name: formData.name,
        email: formData.email,
        collegeName: formData.collegeName,
        passwordHash: formData.password
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "OTP sent!");
        setTimeout(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] relative overflow-hidden px-4">
      {/* Mesh Background blobs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card shadow-2xl rounded-2xl p-8 border relative overflow-hidden"
        >
          {/* Accent spotlights */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

          {/* Branding */}
          <div className="flex flex-col items-center gap-2 mb-8 text-center relative z-10">
            <Logo size="lg" showText={false} className="mb-2" />
            <h2 className="text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white flex items-center gap-1.5 justify-center">
              <GraduationCap className="h-6 w-6 text-primary dark:text-accent" /> Student Registration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign up with your college email to verify your status and request project training.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Deepak Bawa"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">College Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="deepak@college.edu"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>

            {/* College Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">College / Institute Name</label>
              <div className="relative">
                <School className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Thapar University"
                  required
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
                />
              </div>
            </div>

            {/* Banners */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending OTP Code...
                </>
              ) : (
                <>
                  Register & Verify Email
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 relative z-10">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link href="/auth/login" className="text-xs font-semibold text-primary dark:text-accent hover:underline">
              Sign In Here
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
