"use client";

import { useState, useTransition, Suspense } from "react";
import { verifyOtpAction, resendOtpAction } from "@/modules/auth/actions/register";
import { ShieldCheck, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResend] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setResendMessage(null);

    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    startTransition(async () => {
      const result = await verifyOtpAction({ email, otpCode });
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Account activated!");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    });
  };

  const handleResend = () => {
    setError(null);
    setSuccess(null);
    setResendMessage(null);

    startResend(async () => {
      const result = await resendOtpAction(email);
      if (result.error) {
        setError(result.error);
      } else {
        setResendMessage(result.success || "OTP resent.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-left">
          Verification Code
        </label>
        <div className="relative">
          <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            required
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            disabled={isPending}
            className="w-full pl-10 pr-4 py-3 text-lg font-bold tracking-widest text-center bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1 text-left">
          Enter the 6-digit code sent to <span className="font-semibold text-slate-600 dark:text-ccslate-350">{email}</span>.
        </p>
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
      {resendMessage && (
        <div className="p-3 text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{resendMessage}</span>
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
            Verifying Code...
          </>
        ) : (
          <>
            Verify Account
            <ArrowRight className="h-4 w-4 ml-0.5" />
          </>
        )}
      </button>

      {/* Resend Actions */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-xs font-semibold text-primary dark:text-accent hover:underline bg-transparent border-0 cursor-pointer disabled:opacity-50"
        >
          {isResending ? "Resending Code..." : "Resend Code"}
        </button>
        <Link href="/auth/login" className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:underline">
          Return to Sign In
        </Link>
      </div>
    </form>
  );
}

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] relative overflow-hidden px-4">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent/10 dark:bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card shadow-2xl rounded-2xl p-8 border text-center relative overflow-hidden"
        >
          {/* Accent mesh lights */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

          {/* Header Logo & Title */}
          <div className="flex flex-col items-center gap-2 mb-8 text-center relative z-10">
            <Logo size="lg" showText={false} className="mb-2" />
            <h2 className="text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
              Activate Student Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please enter the OTP verification code sent to your academic mailbox.
            </p>
          </div>

          <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}>
            <VerifyOtpForm />
          </Suspense>
        </motion.div>
      </div>
    </main>
  );
}
