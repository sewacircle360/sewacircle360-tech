import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ShieldCheck, Target, Lightbulb, Users2, ArrowRight, Mail, Phone, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Enterprise Trust",
    desc: "We write clean, production-ready code with complete type safety, secure sessions, and soft-delete protections."
  },
  {
    icon: Target,
    title: "Client Centricity",
    desc: "We integrate CRM, digital signatures, and itemized quotations into a unified, transparent journey for clients."
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    desc: "We design modular systems that can easily launch 100+ new software products without modifying core architecture."
  },
  {
    icon: Users2,
    title: "Elite Talent",
    desc: "Our engineers, designers, and database architects have world-class expertise to deliver premium platforms."
  }
];

export const metadata = {
  title: "About Us | SewaCircle360 Technologies",
  description: "Learn about the mission, vision, founder Deepak Bawa, and enterprise principles of SewaCircle360 Technologies.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Who We Are
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
            Engineering the Future of Digital Business
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SewaCircle360 Technologies is a complete digital operating system provider and software engineering agency. We build custom applications, SaaS products, and business pipelines.
          </p>
        </div>

        {/* Leadership Team Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Our Leadership</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">The architects behind SewaCircle360's digital innovations.</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {/* Founder Deepak Bawa */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 border relative overflow-hidden flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-4xl text-white font-display border-4 border-white/10 shadow-xl">
                  DB
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Deepak Bawa</h3>
                  <p className="text-sm font-semibold text-primary dark:text-accent uppercase tracking-wider mt-0.5">Founder & Lead Architect</p>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed italic">
                  "At SewaCircle360, our mission is to build integrated business operating systems that help founders automate customer tracking, sign contracts, and manage billing within one sleek workspace."
                </p>

                {/* Contact Details */}
                <div className="flex flex-col gap-2 mt-2">
                  <a href="mailto:deepakbawa0004@gmail.com" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors justify-center sm:justify-start">
                    <Mail className="h-4 w-4 text-primary dark:text-accent shrink-0" />
                    deepakbawa0004@gmail.com
                  </a>
                  <a href="tel:+919461111010" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors justify-center sm:justify-start">
                    <Phone className="h-4 w-4 text-primary dark:text-accent shrink-0" />
                    +91 9461111010
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 mt-1 justify-center sm:justify-start">
                  <a
                    href="https://instagram.com/deepak.bawaa"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    @deepak.bawaa
                  </a>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <a
                    href="https://www.linkedin.com/in/deepakbawa/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    linkedin.com/in/deepakbawa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              Our Core Principles
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
              Every system we engineer is built around four fundamental core principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-primary/10 transition-all duration-300"
                >
                  <div className="p-3 bg-primary/5 dark:bg-accent/5 text-primary dark:text-accent rounded-xl w-fit">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden flex flex-col items-center gap-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-bold font-display max-w-xl">
              Let's Build Something Premium Together
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Contact our sales architects to build a customized business operations portal for your organization.
            </p>
            <Link
              href="/book-meeting"
              className="flex items-center gap-2 px-6 py-3 font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all duration-300 cursor-pointer shadow-md"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
