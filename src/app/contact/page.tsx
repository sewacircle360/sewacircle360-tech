import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { LeadForm } from "@/modules/crm/components/LeadForm";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react";

export const metadata = {
  title: "Contact Us | SewaCircle360 Technologies",
  description: "Get in touch with SewaCircle360 Technologies. Submit a project request or query to our CRM pipeline.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side: Contact Information cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
                  Get In Touch
                </span>
                <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mt-2 mb-4 leading-tight">
                  Let's Discuss Your Project
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Have a custom software idea or want to launch a SaaS product? Fill out the project brief form, and our sales architecture team will respond within 24 hours.
                </p>
              </div>

              {/* Contact Details List */}
              <div className="flex flex-col gap-4 mt-4">
                {/* Founder Info */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2xl flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-display shrink-0 border border-primary/20">
                    D
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Founder
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Deepak
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2xl flex gap-4 items-center">
                  <div className="p-3 rounded-xl bg-primary/5 text-primary dark:text-accent border">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Send Email
                    </span>
                    <a href="mailto:sewacircle360@gmail.com" className="text-sm font-semibold text-slate-900 dark:text-white hover:underline">
                      sewacircle360@gmail.com
                    </a>
                  </div>
                </div>

                {/* Instagram Handle */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2xl flex gap-4 items-center">
                  <div className="p-3 rounded-xl bg-primary/5 text-primary dark:text-accent border">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Instagram
                    </span>
                    <a href="https://instagram.com/sewacircle360" target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-900 dark:text-white hover:underline">
                      @sewacircle360
                    </a>
                  </div>
                </div>

                {/* Office Location */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-150 rounded-2xl flex gap-4 items-center">
                  <div className="p-3 rounded-xl bg-primary/5 text-primary dark:text-accent border">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Coordinates
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Remote Global / India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Reusable LeadForm */}
            <div className="lg:col-span-7 flex justify-center">
              <LeadForm />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
