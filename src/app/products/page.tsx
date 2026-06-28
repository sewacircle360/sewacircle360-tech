import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getProducts } from "@/modules/products/actions/products";
import { Layers, ArrowRight, ExternalLink, ShieldCheck, Check, Info } from "lucide-react";
import Link from "next/link";

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "SewaCircle360 Suite",
    slug: "sewacircle360",
    category: "CRM & ERP",
    description: "Our flagship enterprise business operating system. Automate customer pipelines, generate itemized quotations, sign electronic agreements, track milestones, and manage invoices.",
    version: "3.2.0",
    status: "LIVE",
    features: [
      "Client Agreement Vault",
      "Dynamic HTML-to-PDF Invoices",
      "Interactive Project Kanban Boards",
      "SMTP Transactional Email Alerts"
    ],
    pricingPlans: [
      { name: "Starter", price: "₹2,999/mo" },
      { name: "Enterprise", price: "₹9,999/mo" }
    ]
  },
  {
    id: "p2",
    name: "School ERP Core",
    slug: "school-erp",
    category: "Education Software",
    description: "A centralized administration software for schools. Manage student registries, fee invoice cycles, attendance registers, report card generations, and teacher databases.",
    version: "1.4.0",
    status: "LIVE",
    features: [
      "Fee Invoicing Matrix",
      "Student Attendance Tracker",
      "Exam Report Generator",
      "Parent Notification Tray"
    ],
    pricingPlans: [
      { name: "Per School", price: "Custom Quote" }
    ]
  },
  {
    id: "p3",
    name: "Hospital ERP Core",
    slug: "hospital-erp",
    category: "Healthcare Software",
    description: "High-performance platform for medical centers. Connect patient intake logs, bed allocation maps, pharmacy stocks, billing invoices, and doctor calendar schedules.",
    version: "2.1.0",
    status: "BETA",
    features: [
      "Patient Intake Vault",
      "Doctor Consultation Calendar",
      "Pharmacy stock check",
      "Health Insurance Billing"
    ],
    pricingPlans: [
      { name: "Per Clinic", price: "Custom Quote" }
    ]
  }
];

export const metadata = {
  title: "SaaS Products | SewaCircle360 Technologies",
  description: "Browse the modular SaaS products and business ERP frameworks engineered by SewaCircle365 Technologies.",
};

export default async function ProductsPage() {
  const dbProducts = await getProducts();
  const productsList = dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS;

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Software Ecosystem
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
            Our Proprietary SaaS Products
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We continuously engineer and maintain business software frameworks that fit into your workflow modules without architectural changes.
          </p>
        </div>

        {/* Products Matrix */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {productsList.map((prod: any, idx: number) => {
            const features = Array.isArray(prod.features) ? prod.features : [];
            const pricingPlans = Array.isArray(prod.pricingPlans) ? prod.pricingPlans : [];
            
            return (
              <div 
                key={prod.id || idx}
                className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-lg transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative overflow-hidden"
              >
                {/* Details Column */}
                <div className="lg:col-span-8 flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent bg-primary/5 dark:bg-accent/5 px-3 py-1 rounded-full border border-primary/10 dark:border-accent/10">
                      {prod.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      v{prod.version}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      prod.status === "LIVE" 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {prod.status}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                    {prod.name}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {prod.description}
                  </p>

                  <div className="border-t border-border/60 dark:border-slate-800/80 pt-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                      Core Capabilities
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.slice(0, 4).map((f: any, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-350">
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{typeof f === "string" ? f : f.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing / CTA Column */}
                <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-6 w-full lg:sticky lg:top-24">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Starting Price
                    </span>
                    <Info className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                      {pricingPlans[0]?.price || "Custom Quote"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {pricingPlans[0]?.name || "Standard Tier"}
                    </span>
                  </div>

                  <Link 
                    href={`/contact?product=${prod.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer"
                  >
                    Request Pricing
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link 
                    href={prod.slug === "sewacircle360" ? "https://sewacircle360.online/" : `/products/${prod.slug}`}
                    target={prod.slug === "sewacircle360" ? "_blank" : undefined}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-950 hover:bg-slate-100 border border-border/80 rounded-xl transition-all cursor-pointer"
                  >
                    View Product Specs
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
