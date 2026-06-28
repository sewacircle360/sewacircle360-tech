import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getPortfolioProjects } from "@/modules/portfolio/actions/portfolio";
import { FolderGit, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";

const DEFAULT_PORTFOLIO = [
  {
    id: "port1",
    name: "E-Commerce Operating System",
    category: "Website & CRM Integration",
    description: "Designed a premium storefront using Next.js, customized Stripe checkout, automated invoice generation using Server Actions, and synchronized order statistics to an administrative CRM dashboard.",
    technologies: ["Next.js", "React", "Tailwind CSS", "Stripe", "Prisma", "PostgreSQL"],
    liveUrl: "https://shop.sewacircle360tech.com",
    coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "port2",
    name: "LMS School Admin Platform",
    category: "Custom Software",
    description: "Developed a secure student ERP system. Embedded student registry fields, dynamic class schedule grids, itemized fee receipts, and built a custom parent portal with email alerts.",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Express", "Docker"],
    liveUrl: "https://school.sewacircle360tech.com",
    coverUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "port3",
    name: "Telemedicine Patient Portal",
    category: "Mobile Application",
    description: "Engineered a cross-platform iOS & Android mobile app. Configured instant messaging, doctor schedule calendar sync, secure medical document vault storage, and offline prescription lists.",
    technologies: ["React Native", "Expo", "SQLite", "Firebase", "Node.js"],
    liveUrl: "https://clinic.sewacircle360tech.com",
    coverUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  }
];

export const metadata = {
  title: "Case Studies & Portfolio | SewaCircle360 Technologies",
  description: "Browse the custom software, websites, and business operating applications developed by SewaCircle365 Technologies.",
};

export default async function PortfolioPage() {
  const dbPortfolio = await getPortfolioProjects();
  const portfolioList = dbPortfolio.length > 0 ? dbPortfolio : DEFAULT_PORTFOLIO;

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Case Studies
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
            Our Digital Projects Showcase
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We build high-performance applications designed to increase revenue, automate client relationships, and improve operational output.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioList.map((project: any, idx: number) => (
            <div 
              key={project.id || idx}
              className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Cover Image mock container */}
                <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/30 to-transparent z-10" />
                  <img 
                    src={project.coverUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"} 
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-2.5 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Technologies Used row */}
              <div className="px-6 pb-6 pt-0 border-t border-border/60 dark:border-slate-800/80 mt-auto">
                <div className="flex flex-wrap gap-1.5 pt-4 mb-5">
                  {project.technologies?.map((tech: string, techIdx: number) => (
                    <span 
                      key={techIdx}
                      className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-border/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer link */}
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-accent hover:underline cursor-pointer"
                  >
                    View Project
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
