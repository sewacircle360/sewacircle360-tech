"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { sendForgotPasswordOtpAction, verifyOtpAndResetPasswordAction } from "@/modules/auth/actions/forgot-password";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mockOtp, setMockOtp] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isResending, startResend] = useTransition();

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setSuccess(null);
    setMockOtp(null);

    startTransition(async () => {
      const result = await sendForgotPasswordOtpAction(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "OTP generated successfully.");
        if (result.mockOtp) {
          setMockOtp(result.mockOtp);
        }
        setStep(2);
      }
    });
  };

  const handleResendOtp = () => {
    if (!email) return;
    setError(null);
    setSuccess(null);
    
    startResend(async () => {
      const result = await sendForgotPasswordOtpAction(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("A new OTP code has been sent.");
        if (result.mockOtp) {
          setMockOtp(result.mockOtp);
        }
      }
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await verifyOtpAndResetPasswordAction({
        email,
        otpCode,
        newPasswordHash: newPassword,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Password reset successful.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2500);
      }
    });
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
        className="w-full max-w-md bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl backdrop-blur-md relative z-10"
      >
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <Logo size="lg" showText={false} className="mb-2" />
          <h2 className="text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
            {step === 1 ? "Reset Password" : "Verify OTP & Reset"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {step === 1 
              ? "Enter your email address to receive a secure OTP code."
              : "Enter the OTP code sent to your mailbox and choose a new password."}
          </p>
        </div>

        {/* Global Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 mb-4 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 mb-4 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-start gap-2.5"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}

          {mockOtp && step === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-4 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 rounded-xl flex flex-col gap-1.5"
            >
              <div className="flex items-start gap-2.5 font-semibold">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Development/Testing Mode Helper</span>
              </div>
              <p>Since email transmission is in local/sandbox setup, use this code: <strong className="text-sm tracking-wider font-mono bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">{mockOtp}</strong></p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forms */}
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-400"
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
                  Generating OTP...
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* OTP Code Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Verification OTP
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-3 text-sm tracking-widest font-mono font-bold bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Guidelines */}
            <p className="text-[10px] text-slate-500 leading-relaxed dark:text-slate-400">
              * Password must be between 6 and 30 characters, and contain at least one letter, one number, and one special character.
            </p>

            <button
              type="submit"
              disabled={isPending || !otpCode || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </>
              )}
            </button>

            {/* Verification-specific Action Group */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || isPending}
                className="text-xs font-semibold text-primary dark:text-accent hover:underline bg-transparent border-0 cursor-pointer disabled:opacity-50"
              >
                {isResending ? "Resending Code..." : "Resend Code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpCode("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError(null);
                  setSuccess(null);
                  setMockOtp(null);
                }}
                disabled={isPending}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 hover:underline bg-transparent border-0 cursor-pointer"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-border/80 dark:border-slate-800/80 text-center">
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
