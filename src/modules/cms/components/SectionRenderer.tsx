"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  HelpCircle, 
  Mail, 
  Phone,
  Briefcase, 
  ChevronRight, 
  Code, 
  Layers, 
  Smartphone,
  Globe,
  TrendingUp,
  Cpu,
  Smile,
  ShieldCheck,
  Calendar,
  Send,
  Loader2
} from "lucide-react";

// Types mapping for icons
const ICON_MAP: Record<string, any> = {
  Web: Globe, Code, Layers, Briefcase, TrendingUp, Cpu, ShieldCheck
};

interface SectionProps {
  type: string;
  content: any;
}

export function SectionRenderer({ type, content }: SectionProps) {
  switch (type) {
    case "HERO":
      return <HeroSection content={content} />;
    case "STATISTICS":
      return <StatsSection content={content} />;
    case "SERVICES":
      return <ServicesSection content={content} />;
    case "PROCESS":
      return <ProcessSection content={content} />;
    case "FAQ":
      return <FAQSection content={content} />;
    case "CTA":
      return <CTASection content={content} />;
    default:
      return (
        <div className="py-12 text-center text-slate-500 border border-dashed rounded-lg my-4">
          Section wrapper: <span className="font-bold">{type}</span> (Placeholder)
        </div>
      );
  }
}

/* ==========================================================================
   HERO SECTION
   ========================================================================== */
function HeroSection({ content }: { content: any }) {
  const words = content.typingWords || [
    "Powerful Software.",
    "Modern Websites.",
    "Mobile Apps.",
    "SaaS Products.",
    "Digital Businesses."
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = words[currentWordIndex];
    
    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        
        if (currentText === fullWord) {
          // Pause at full word
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        // Deleting
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
      
      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(handleType, speed);
    };

    timer = setTimeout(handleType, 100);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Mesh Gradient Spotlight Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/15 dark:bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Grid Pattern Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Copy */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs tracking-wider uppercase w-fit"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            {content.tagline || "Engineering Digital Excellence"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0f172a] dark:text-white font-display leading-[1.1]"
          >
            {content.headline || "We Build"} <br />
            <span className="gradient-text font-extrabold">{currentText}</span>
            <span className="animate-pulse text-primary dark:text-accent">|</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#334155] dark:text-[#cbd5e1] leading-relaxed max-w-xl"
          >
            {content.description || "Transform your vision into high-performance enterprise platforms. We engineering scalable software architecture, custom website experiences, and modular SaaS ecosystems."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              href={content.primaryBtnLink || "/contact"}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/25 cursor-pointer"
            >
              {content.primaryBtnText || "Start Your Project"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={content.secondaryBtnLink || "/services"}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-border/80 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              {content.secondaryBtnText || "Explore Services"}
            </Link>
          </motion.div>
        </div>

        {/* Right Side Parallax Cards */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[400px] h-[380px]"
          >
            {/* Background glowing card */}
            <div className="absolute top-10 left-10 right-0 bottom-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-xl" />
            
            {/* Front Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 glass-card rounded-2xl p-6 flex flex-col justify-between border shadow-2xl relative"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-primary/10 text-primary dark:text-accent">
                  <Code className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">
                  Business OS
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-primary dark:text-accent">
                  Active Platform
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  SewaCircle360 CRM & CMS
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Decoupled domain layout mapping 100+ items seamlessly in real-time.
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-400 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-white">U1</div>
                  <div className="w-6 h-6 rounded-full bg-slate-600 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-white">U2</div>
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-950 flex items-center justify-center font-bold text-[8px] text-white">U3</div>
                </div>
                <span>4.8/5 Customer Rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}

/* ==========================================================================
   STATISTICS SECTION
   ========================================================================== */
function StatsSection({ content }: { content: any }) {
  const stats = content.stats || [
    { value: "150+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "12+", label: "SaaS Products" },
    { value: "7+", label: "Years Experience" },
  ];

  return (
    <section className="py-12 border-y bg-slate-50/50 dark:bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col gap-1"
            >
              <span className="text-3xl sm:text-4xl font-extrabold font-display gradient-text">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   SERVICES SECTION
   ========================================================================== */
function ServicesSection({ content }: { content: any }) {
  const services = content.services || [
    { title: "Website Development", description: "Responsive marketing sites & CMS integration using Next.js & Tailwind.", icon: "Web" },
    { title: "Software Development", description: "Custom enterprise backend portals, CRM, ERP, and API architectures.", icon: "Code" },
    { title: "Mobile App Development", description: "Cross-platform native iOS & Android applications using React Native.", icon: "Cpu" },
    { title: "UI UX Design", description: "Luxurious design prototypes, detailed client wireframes, and branding guidelines.", icon: "Layers" },
    { title: "SEO & Digital Marketing", description: "Search ranking optimization and automated lead capturing workflows.", icon: "TrendingUp" },
    { title: "Scalable SaaS Hosting", description: "Cloud infrastructure provisioning, Docker setups, and CI/CD pipelines.", icon: "ShieldCheck" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#020617] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Core Capacities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white leading-tight">
            Comprehensive Digital Engineering
          </h3>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl">
            We provide modular, plug-and-play services to scale your company’s online footprint and operational workflows.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv: any, idx: number) => {
            const Icon = ICON_MAP[srv.icon] || Code;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group p-6 bg-slate-50 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900 border border-slate-100 hover:border-primary/20 dark:border-slate-800/40 dark:hover:border-accent/20 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Spotlight effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="p-3 bg-white dark:bg-slate-950 border border-border/80 dark:border-slate-800 rounded-xl text-primary dark:text-accent w-fit mb-5 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                  {srv.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal mb-4">
                  {srv.description}
                </p>
                <Link 
                  href={`/services#${srv.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary dark:text-accent hover:underline group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  Learn More
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   PROCESS TIMELINE SECTION
   ========================================================================== */
function ProcessSection({ content }: { content: any }) {
  const steps = content.steps || [
    { number: "01", title: "Discovery", description: "Requirements gathering, user maps, and high-level architectural brainstorming." },
    { number: "02", title: "Design", description: "Creating detailed Figma screens, design systems, and visual UI layouts." },
    { number: "03", title: "Development", description: "Writing modular clean code with type-safety and regular client updates." },
    { number: "04", title: "Deployment", description: "Automated test runs, server configurations, and live product launches." },
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Workflow Journey
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white">
            Engineering Lifecycle
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            We follow a structured, agile approach to guarantee fast delivery times and premium clean codebase structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[2px] bg-slate-200 dark:bg-slate-800 pointer-events-none" />

          {steps.map((step: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col items-center md:items-start text-center md:text-left gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-primary dark:border-accent flex items-center justify-center font-bold text-sm text-primary dark:text-accent shadow-md relative z-10 font-display">
                {step.number}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1">
                  {step.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FAQ SECTION
   ========================================================================== */
function FAQSection({ content }: { content: any }) {
  const faqs = content.faqs || [
    { q: "What types of software products do you build?", a: "We build custom web systems, mobile applications (iOS/Android), administrative ERP platforms, Customer Relationship Suites (CRM), and SaaS products customized for enterprise workflows." },
    { q: "How long does a standard web development cycle take?", a: "A standard corporate project usually takes between 3 to 6 weeks, depending on design complexity and integration requirements. Custom ERP systems or SaaS platforms run on custom sprint plans." },
    { q: "Do you offer post-launch maintenance?", a: "Yes, we provide ongoing monthly maintenance contracts covering package updates, security patches, file storage cleanups, sitemap monitoring, and server scaling support." },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white dark:bg-[#020617]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center mb-16">
          <HelpCircle className="h-8 w-8 text-primary dark:text-accent" />
          <h3 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about our collaboration structures and technology selections.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, idx: number) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-border/80 dark:border-slate-800/80 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20"
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-slate-200 hover:text-primary dark:hover:text-accent transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="font-display">{faq.q}</span>
                  <span className="text-lg shrink-0 ml-4 font-normal">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400 border-t border-border/40 dark:border-slate-800/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CALL TO ACTION SECTION
   ========================================================================== */
function CTASection({ content }: { content: any }) {
  return (
    <section className="py-24 relative overflow-hidden bg-[#020617] text-white">
      {/* Visual lighting spots */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/25 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 flex flex-col items-center gap-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight tracking-tight max-w-2xl">
          {content.headline || "Ready to Transform Your Operations?"}
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
          {content.description || "Let's build a premium digital ecosystem customized for your business workflows. Schedule a session or get a customized service quote today."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href={content.primaryBtnLink || "/book-meeting"}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            {content.primaryBtnText || "Book a Consultation"}
          </Link>
          <Link
            href={content.secondaryBtnLink || "/contact"}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all duration-300 cursor-pointer"
          >
            {content.secondaryBtnText || "Contact Team"}
          </Link>
        </div>
      </div>
    </section>
  );
}
