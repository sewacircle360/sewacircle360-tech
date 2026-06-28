import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { 
  Laptop, 
  Code, 
  Smartphone, 
  Layers, 
  LineChart, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Terminal,
  Cpu
} from "lucide-react";
import Link from "next/link";

const SERVICES_DETAILED = [
  {
    icon: Laptop,
    title: "Website Development",
    desc: "We build premium, search-optimized marketing websites and headless content management systems (CMS) using Next.js 15, React 19, and Tailwind CSS. Every site features fast loading scores and fully responsive grids.",
    benefits: ["Dynamic Server Rendering", "Seeded CMS Configs", "Lighthouse 100 SEO", "Mobile-First Coding"]
  },
  {
    icon: Code,
    title: "Custom Software Development",
    desc: "We engineer enterprise-grade backend operating systems, API frameworks, custom ERP platforms, inventory lists, and CRM modules. Our systems are built using decoupled micro-service concepts.",
    benefits: ["Robust Zod Schemas", "Next.js Server Actions", "TypeScript Parity", "REST API Envelopes"]
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "We develop high-performance cross-platform iOS & Android mobile applications. We configure push notifications, local SQLite caches, background sync workers, and client portal synchronization.",
    benefits: ["React Native Hubs", "Offline Local Storage", "Secure Token Auth", "Google/Apple Publishing"]
  },
  {
    icon: Layers,
    title: "UI UX Design",
    desc: "We create luxurious design prototypes in Figma, detailed user mapping hierarchies, brand systems, layout wireframes, typography tokens, and magnetic click interactions.",
    benefits: ["Geist / Space Grotesk", "Dark/Light Mockups", "Interactive Prototypes", "Custom SVG Logos"]
  },
  {
    icon: LineChart,
    title: "SEO & Digital Marketing",
    desc: "We build structured data schemas, XML sitemaps, robots tags, sitemap submission tools, and automated WhatsApp/SMTP marketing hooks to turn visitors into leads.",
    benefits: ["Schema.org JSON-LD", "Robots & Sitemap XML", "Leads Auto-CRM Hook", "Render SMTP Alerts"]
  },
  {
    icon: ShieldCheck,
    title: "SaaS & Cloud Hosting",
    desc: "We configure Docker containers, setup private GitHub CI/CD pipelines, provision MongoDB Atlas clusters, configure SSL, and deploy platforms to Render or AWS.",
    benefits: ["Docker Compose Ready", "MongoDB Atlas Clusters", "Render CI/CD Auto-builds", "SSL & CSRF Safety"]
  }
];

export const metadata = {
  title: "Services | SewaCircle360 Technologies",
  description: "Explore our range of professional digital services, including custom software, websites, mobile apps, UI/UX, and cloud hosting.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            What We Do
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
            Enterprise Digital Operations
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We provide full-stack capabilities, enabling you to launch custom applications and automate customer relationships from a single portal.
          </p>
        </div>

        {/* Services List Detail Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {SERVICES_DETAILED.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx}
                className="p-8 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3.5 bg-primary/5 dark:bg-accent/5 text-primary dark:text-accent rounded-2xl w-fit mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                </div>
                
                {/* Benefits / Core Features list */}
                <div className="border-t border-border/60 dark:border-slate-800/80 pt-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                    Core Implementations
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {srv.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-accent shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consultation Callout */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-24">
          <div className="glass-card border rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col items-center gap-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white leading-tight">
              Need a Custom Solution Built?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Book a live consultation call with our solution architects to structure a plan, establish a budget estimate, and verify delivery timelines.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book-meeting"
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
              >
                Book Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
