"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { bookMeetingAction } from "../actions/bookings";
import { Calendar, Clock, Globe, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const BookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  meetingType: z.string().min(1, { message: "Please select a meeting type." }),
  preferredDate: z.string().min(1, { message: "Please select a date." }),
  preferredTime: z.string().min(1, { message: "Please select a time slot." }),
  timezone: z.string().min(1, { message: "Please select your timezone." }),
  details: z.string().optional(),
  budget: z.string().optional(),
});

type BookingInput = z.infer<typeof BookingSchema>;

const MEETING_TYPES = [
  "Discovery Consultation (30 mins)",
  "Project Scope Workshop (60 mins)",
  "SaaS Product Review (45 mins)",
  "ERP Demo & Walkthrough (45 mins)",
];

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM"
];

const TIMEZONES = [
  "UTC +5:30 (India Standard Time)",
  "UTC -5:00 (Eastern Standard Time)",
  "UTC +0:00 (Greenwich Mean Time)",
  "UTC +8:00 (Singapore Standard Time)",
];

export function BookingForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: "",
      email: "",
      meetingType: "",
      preferredDate: "",
      preferredTime: "",
      timezone: "UTC +5:30 (India Standard Time)",
      details: "",
      budget: "Flexible",
    }
  });

  const onSubmit = (data: BookingInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await bookMeetingAction({
          ...data,
          preferredDate: new Date(data.preferredDate),
        });
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);
          reset();
        }
      } catch (err) {
        setError("An unexpected scheduling error occurred. Please try again.");
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
              Your Name *
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Meeting Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Meeting Type *
            </label>
            <select
              {...register("meetingType")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all cursor-pointer"
            >
              <option value="">Select Option</option>
              {MEETING_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.meetingType && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.meetingType.message}
              </span>
            )}
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Preferred Date *
            </label>
            <input
              type="date"
              {...register("preferredDate")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all cursor-pointer"
            />
            {errors.preferredDate && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.preferredDate.message}
              </span>
            )}
          </div>

          {/* Time Slots */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Time Slot *
            </label>
            <select
              {...register("preferredTime")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all cursor-pointer"
            >
              <option value="">Select Time</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {errors.preferredTime && (
              <span className="text-xs text-red-500 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="h-3 w-3" />
                {errors.preferredTime.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Timezone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Timezone *
            </label>
            <div className="relative">
              <select
                {...register("timezone")}
                disabled={isPending}
                className="w-full px-4 py-2.5 pl-10 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Project Budget */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estimated Project Budget
            </label>
            <select
              {...register("budget")}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all cursor-pointer"
            >
              <option value="Flexible">Flexible / Not Decided</option>
              <option value="Under ₹50,000">Under ₹50,000</option>
              <option value="₹50,000 - ₹2,00,000">₹50,000 - ₹2,00,000</option>
              <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
              <option value="₹5,00,000+">₹5,00,000+</option>
            </select>
          </div>
        </div>

        {/* Project details / Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Agenda / Project Details
          </label>
          <textarea
            rows={3}
            placeholder="Tell us what you would like to discuss (e.g. database performance concerns, frontend architecture migration, or pricing configurations)..."
            {...register("details")}
            disabled={isPending}
            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-accent/20 focus:border-primary dark:focus:border-accent text-foreground transition-all resize-none"
          />
        </div>

        {/* Banners */}
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
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scheduling Call...
            </>
          ) : (
            <>
              Schedule Consultation
              <ArrowRight className="h-4 w-4 ml-0.5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
