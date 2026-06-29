import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { notFound } from "next/navigation";
import { 
  Laptop, 
  Code, 
  Smartphone, 
  Layers, 
  LineChart, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Cpu
} from "lucide-react";
import Link from "next/link";

interface ServiceDetail {
  title: string;
  icon: any;
  tagline: string;
  description: string;
  capabilities: string[];
  process: { step: string; title: string; desc: string }[];
  pricing: { tier: string; price: string; desc: string; features: string[] }[];
}

const SERVICES_DATA: Record<string, ServiceDetail> = {
  "website-development": {
    title: "Website Development",
    icon: Laptop,
    tagline: "Headless CMS, React Frameworks & Speed Optimization",
    description: "We engineer hyper-fast marketing sites and headless e-commerce platforms. Leveraging Next.js 16, React 19, and Tailwind CSS, we deliver pixel-perfect digital properties optimized for Google Lighthouse scores.",
    capabilities: [
      "Next.js App Router Architecture",
      "Headless Content Management Systems (Sanity, Strapi, Contentful)",
      "Server-Side Rendering & ISR Caching",
      "Lighthouse 100 SEO-friendly layouts",
      "Responsive Fluid Grid Systems",
      "Full Localization & Internationalization (i18n)"
    ],
    process: [
      { step: "01", title: "UX Discovery", desc: "Mapping layout wireframes, font choices, and typography tokens." },
      { step: "02", title: "API Configuration", desc: "Setting up decoupled CMS structures and Zod validation layers." },
      { step: "03", title: "Development", desc: "Coding responsive interfaces using Tailwind CSS and Framer Motion." },
      { step: "04", title: "Performance Tuning", desc: "Optimizing images, bundling sizes, and deploying to global CDNs." }
    ],
    pricing: [
      {
        tier: "Standard Startup",
        price: "₹24,999",
        desc: "Best for growing businesses seeking premium portfolio sites.",
        features: ["5 Custom Next.js Pages", "CMS Integration", "Contact Forms Integration", "Responsive layouts", "1 Month Support"]
      },
      {
        tier: "Enterprise OS",
        price: "Custom Quote",
        desc: "Tailored portals with client auth, payment setups, and CRM hooks.",
        features: ["Unlimited Pages", "Custom DB Architecture", "Role-based dashboards", "API Integrations", "6 Months Support"]
      }
    ]
  },
  "software-development": {
    title: "Custom Software Development",
    icon: Code,
    tagline: "Robust Backend APIs, Custom CRM & ERP Ecosystems",
    description: "Build secure, scalable internal operating platforms. We construct modular database schemas, design JSON REST APIs, and implement custom logic panels to automate operational relationships.",
    capabilities: [
      "Granular Database Modeling (MongoDB, PostgreSQL, Prisma)",
      "Secure NextAuth v5 session configurations",
      "Modular Server Actions and Zod validations",
      "Integrated Email Hooks (SMTP, Resend API)",
      "Invoice and Quotation PDF auto-generators",
      "Client Relationship (CRM) Kanban trackers"
    ],
    process: [
      { step: "01", title: "Requirements Mapping", desc: "Structuring user stories, data schemas, and access controls." },
      { step: "02", title: "Prisma Modeling", desc: "Defining relations, indexes, and constraints in MongoDB Atlas." },
      { step: "03", title: "API Development", desc: "Building type-safe server mutations and validation pipelines." },
      { step: "04", title: "Testing & Deploy", desc: "Conducting integration audits and deploying to Node containers." }
    ],
    pricing: [
      {
        tier: "Modular Module",
        price: "₹49,999",
        desc: "Add custom billing or tracking models to existing setups.",
        features: ["Custom DB Tables", "Zod Validation Pipelines", "Role Authorization Hooks", "Auto SMTP Alerts", "3 Months Support"]
      },
      {
        tier: "Full Enterprise ERP",
        price: "Custom Quote",
        desc: "End-to-end custom CRM, invoicing, and team operations software.",
        features: ["Full DB Design", "Admin Dashboard", "Client Portals", "Advanced Analytics Panels", "1 Year Support"]
      }
    ]
  },
  "mobile-app-development": {
    title: "Mobile App Development",
    icon: Smartphone,
    tagline: "Cross-Platform iOS & Android Native Solutions",
    description: "Launch mobile products built with React Native. We deploy performant applications featuring local SQLite storage, background workers, local sync protocols, and native notification push systems.",
    capabilities: [
      "React Native & Expo Hub integration",
      "Native Apple App Store & Google Play deployments",
      "Secure Token-based login storage",
      "Offline Sync & SQLite Database architectures",
      "Framer Motion React Native layout animations",
      "Real-time GPS tracking & maps hooks"
    ],
    process: [
      { step: "01", title: "Figma Designing", desc: "Creating luxury dark mode user screens and gesture systems." },
      { step: "02", title: "Local Schema Setup", desc: "Writing SQLite local caching schemas for offline access." },
      { step: "03", title: "API Synchronization", desc: "Connecting backend endpoints and server notifications." },
      { step: "04", title: "Build Store Audits", desc: "Publishing test versions to Google Internal Track and TestFlight." }
    ],
    pricing: [
      {
        tier: "MVP Hybrid App",
        price: "₹74,999",
        desc: "Essential native app to launch your software product idea.",
        features: ["Expo Native codebase", "API integration", "Push Notifications", "Profile dashboard", "3 Months Support"]
      },
      {
        tier: "Custom Operating App",
        price: "Custom Quote",
        desc: "Advanced mobile app with offline-first synchronization features.",
        features: ["Native Android & iOS builds", "SQLite local caching", "Payment integrations", "Offline sync manager", "Support Contracts"]
      }
    ]
  },
  "ui-ux-design": {
    title: "UI / UX Design",
    icon: Layers,
    tagline: "Luxurious Graphic Layouts, Branding & Figma Prototypes",
    description: "Figma layouts designed for maximum engagement. We establish layout typography tokens, select tailored color palettes, build interactive mockup flows, and outline branding systems.",
    capabilities: [
      "Tailored Figma Component Design Systems",
      "Luxurious glassmorphic interactive web mocks",
      "Typography styling hierarchies & Outfit scale",
      "Curated Tailwind CSS and Vanilla CSS custom variables",
      "Interactive clickable prototypes",
      "Logo and Vector Icon sets generation"
    ],
    process: [
      { step: "01", title: "Moodboarding", desc: "Drafting color concepts, custom gradients, and font references." },
      { step: "02", title: "Wireframing", desc: "Establishing grid placements and functional user paths." },
      { step: "03", title: "Mockup Refinements", desc: "Assembling micro-interactions and dark mode interfaces." },
      { step: "04", title: "Figma Assets Handoff", desc: "Creating organized SVG files and developer design spec guidelines." }
    ],
    pricing: [
      {
        tier: "Figma Starter Mock",
        price: "₹14,999",
        desc: "Ideal for verifying layouts and aesthetics before coding.",
        features: ["Landing Page + 3 subpages", "Dark/Light Mockups", "Typography Design System", "SVG Assets Included"]
      },
      {
        tier: "Full Brand Strategy",
        price: "Custom Quote",
        desc: "Complete corporate identity system and platform wireframes.",
        features: ["Unlimited Screens UI", "Interactive Prototype link", "Custom Vector Logos", "Design System Document"]
      }
    ]
  },
  "seo-marketing": {
    title: "SEO & Digital Marketing",
    icon: LineChart,
    tagline: "Search Optimization, Structured Data & Lead Auto-Hooks",
    description: "Drive traffic and convert users. We optimize metadata structures, write schema markup logs, configure robots.txt, and link automated SMS/WhatsApp hooks to capture leads.",
    capabilities: [
      "Schema.org JSON-LD Structured Data configurations",
      "Robots.txt and XML Sitemap generation",
      "Google Search Console setups & Sitemap submissions",
      "Dynamic meta titles & page description tags",
      "Automated SMTP lead mail hooks",
      "Lighthouse 100 Core Web Vitals checks"
    ],
    process: [
      { step: "01", title: "Keywords Audit", desc: "Analyzing search intent and search volumes." },
      { step: "02", title: "On-Page Tuning", desc: "Injecting semantic HTML5 elements and structured schemas." },
      { step: "03", title: "Integration hooks", desc: "Wiring CRM landing leads hooks to WhatsApp/Email APIs." },
      { step: "04", title: "Monitoring", desc: "Reviewing page views and indexing statuses in Search Console." }
    ],
    pricing: [
      {
        tier: "Growth Kickstart",
        price: "₹9,999",
        desc: "Setup indexing tools and verify sitemap structure for search visibility.",
        features: ["JSON-LD Schema Setup", "XML Sitemap & Robots XML", "Search Console Mapping", "Core Web Vitals tuning"]
      },
      {
        tier: "Full SEO Suite",
        price: "Custom Quote",
        desc: "Monthly optimizations and integration with automated lead capture triggers.",
        features: ["Ongoing Audit Logs", "Lead Capture Form Hooks", "Email Campaign Integrations", "Competitor Analytics reports"]
      }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = SERVICES_DATA[slug];
  if (!data) return {};
  return {
    title: `${data.title} Services | SewaCircle360 Technologies`,
    description: data.tagline,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative">
          <div className="absolute inset-0 top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 dark:bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="p-4 bg-primary/5 dark:bg-accent/5 text-primary dark:text-accent rounded-2xl w-fit mx-auto mb-6 border border-primary/10 dark:border-accent/10">
            <Icon className="h-8 w-8" />
          </div>
          
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Core Expertise
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white mt-3 mb-6 leading-tight max-w-3xl mx-auto">
            {service.title}
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-4">
            {service.tagline}
          </p>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {service.description}
          </p>
        </section>

        {/* Capabilities Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-8 border-b pb-4">
              Service Capabilities & Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.capabilities.map((cap, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border dark:border-slate-850/60 hover:border-primary/20 dark:hover:border-accent/20 transition-colors">
                  <div className="p-1 bg-green-500/10 text-green-500 rounded-lg shrink-0 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Map */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h2 className="text-2xl font-bold font-display text-center text-slate-900 dark:text-white mb-12">
            Engineering Execution Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.process.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-3.5 relative p-6 bg-white dark:bg-slate-900/20 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <span className="text-4xl font-black text-primary/10 dark:text-accent/15 font-display leading-none">
                  {step.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing & Estimates */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
          <h2 className="text-2xl font-bold font-display text-center text-slate-900 dark:text-white mb-12">
            Project Budgets & Deliverables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.pricing.map((tier, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div>
                  <h4 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                    {tier.tier}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    {tier.desc}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                      {tier.price}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">starting estimate</span>
                  </div>
                  <ul className="space-y-3.5 mb-8 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Zap className="h-3.5 w-3.5 text-primary dark:text-accent shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 cursor-pointer"
                >
                  Start Project Scope
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 text-center mt-20">
          <div className="glass-card border rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col items-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Ready to construct your project?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Book a live consultation call to align project parameters, outline budget boundaries, and verify schedule milestones.
            </p>
            <Link
              href="/book-meeting"
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
