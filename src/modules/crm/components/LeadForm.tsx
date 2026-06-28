"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LeadSchema, LeadInput } from "../schemas";
import { createLeadAction } from "../actions/leads";
import { Send, Loader2, AlertCircle, CheckCircle2, DollarSign, Calendar, MessageSquare, ChevronDown } from "lucide-react";

const SERVICES = [
  "Website Development",
  "Custom Software Development",
  "Mobile App Development",
  "UI UX Design",
  "Graphic Design",
  "Digital Marketing / SEO",
  "SaaS Product Consulting",
  "Other Services",
];

const BUDGETS = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
];

const TIMELINES = [
  "Urgent (Less than 2 weeks)",
  "1 - 2 Months",
  "2 - 4 Months",
  "4+ Months",
  "Flexible",
];

export function LeadForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      whatsapp: "",
      country: "",
      service: "",
      budget: "",
      timeline: "",
      message: "",
    },
  });

  const onSubmit = (data: LeadInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await createLeadAction(data);
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);
          reset();
        }
      } catch (err) {
        setError("An unexpected system error occurred. Please try again.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-white dark:bg-[#090d1f]/80 glass-card rounded-2xl p-6 sm:p-8 border shadow-xl relative"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Deepak Kumar"
              {...register("name")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300"
            />
            {errors.name && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="deepak@company.com"
              {...register("email")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300"
            />
            {errors.email && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              {...register("phone")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300"
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Acme Corp"
              {...register("companyName")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300"
            />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              {...register("whatsapp")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Country
            </label>
            <input
              type="text"
              placeholder="India"
              {...register("country")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Service Required */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Service *
            </label>
            <div className="relative">
              <select
                {...register("service")}
                disabled={isPending}
                className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Service</option>
                {SERVICES.map((srv) => (
                  <option key={srv} value={srv}>{srv}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.service && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.service.message}
              </span>
            )}
          </div>

          {/* Budget Range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estimated Budget *
            </label>
            <div className="relative">
              <select
                {...register("budget")}
                disabled={isPending}
                className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Budget</option>
                {BUDGETS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              <DollarSign className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.budget && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.budget.message}
              </span>
            )}
          </div>

          {/* Expected Timeline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Timeline *
            </label>
            <div className="relative">
              <select
                {...register("timeline")}
                disabled={isPending}
                className="w-full appearance-none px-4 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 cursor-pointer"
              >
                <option value="">Select Timeline</option>
                {TIMELINES.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.timeline && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.timeline.message}
              </span>
            )}
          </div>
        </div>

        {/* Message / Brief */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Brief / Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <textarea
              rows={4}
              placeholder="Tell us about your project requirements, target audience, and business goals..."
              {...register("message")}
              disabled={isPending}
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all duration-300 resize-none"
            />
          </div>
        </div>

        {/* Action Feedbacks */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/25 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              Send Project Request
              <Send className="h-4 w-4 ml-0.5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
