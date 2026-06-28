"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    // Mocking email recovery link dispatch
    setTimeout(() => {
      setIsPending(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] px-4 py-12 transition-colors duration-300 relative overflow-hidden">
      {/* Spotlight background graphics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-ccslate-850 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-md relative z-10"
      >
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <Logo size="lg" showText={false} className="mb-2" />
          <h2 className="text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email address to receive password recovery instructions.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="deepakbawa0004@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !email}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Recovery Link
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center py-4"
          >
            <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Check Your Inbox
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-700 dark:text-ccslate-350">{email}</span>, we have sent a secure password reset link to it.
              </p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-border/80 dark:border-slate-800/80 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary dark:hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
