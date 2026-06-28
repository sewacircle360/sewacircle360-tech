"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoginSchema, LoginInput } from "../schemas";
import { loginAction } from "../actions/login";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await loginAction(data);
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);
        }
      } catch (err) {
        setError("An unexpected authentication error occurred.");
      }
    });
  };

  return (
    <div className="w-full max-w-md px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card shadow-2xl rounded-2xl p-8 border relative overflow-hidden"
      >
        {/* Animated Accent Spotlight */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        {/* Branding header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center relative z-10">
          <Logo size="lg" showText={false} className="mb-2" />
          <h2 className="text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
            Access Business OS
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage projects, products, and clients.
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {/* Email input field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                placeholder="sewacircle360@gmail.com"
                {...register("email")}
                disabled={isPending}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-primary dark:text-accent hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                disabled={isPending}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 dark:text-slate-500 hover:text-foreground cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Remember me toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              disabled={isPending}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 dark:focus:ring-accent/20 focus:ring-2 bg-slate-50 dark:bg-slate-950 outline-none"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none"
            >
              Remember this device
            </label>
          </div>

          {/* Feedback banners */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm bg-red-500/10 dark:bg-red-500/5 text-red-500 border border-red-500/20 rounded-xl flex items-start gap-2.5"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="font-medium leading-normal">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm bg-green-500/10 dark:bg-green-500/5 text-green-500 border border-green-500/20 rounded-xl flex items-start gap-2.5"
            >
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="font-medium leading-normal">{success}</span>
            </motion.div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
