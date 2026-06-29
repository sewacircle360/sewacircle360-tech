"use client";

import { useState } from "react";
import { JobApplicationForm } from "./JobApplicationForm";
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function JobsList({ initialJobs }: { initialJobs: any[] }) {
  const [selectedRole, setSelectedRole] = useState("");

  const handleApplyClick = (title: string) => {
    setSelectedRole(title);
    const element = document.getElementById("apply-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Listings Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-24 flex flex-col gap-6 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-2">Open Opportunities</h2>
        
        {initialJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No active positions</span>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
              We don't have any specific open roles at this moment. However, we are always searching for exceptional engineering and design talent. Submit a general application below!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {initialJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-450 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleApplyClick(job.title)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 md:self-center"
                >
                  Apply Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <JobApplicationForm selectedRole={selectedRole} />
    </>
  );
}
