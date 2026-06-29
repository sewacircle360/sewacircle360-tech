import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getJobPositions } from "@/modules/careers/actions/careers";
import { JobsList } from "./JobsList";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Careers | SewaCircle360 Technologies",
  description: "Build the future of digital ecosystems with us. Browse our open positions and internship opportunities.",
};

export default async function CareersPage() {
  const jobs = await getJobPositions();

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs tracking-wider uppercase mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Join Our Team
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-6 leading-tight">
            Build the Future of Enterprise Software
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are looking for creators, thinkers, and builders to help us develop next-generation corporate operating systems and premium SaaS ecosystems.
          </p>
        </div>

        <JobsList initialJobs={jobs} />

      </main>
      <Footer />
    </>
  );
}
