"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { 
  Instagram, 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Send,
  Loader2
} from "lucide-react";

const SERVICES_LINKS = [
  { label: "Website Development", href: "/services/website-development" },
  { label: "Software Development", href: "/services/software-development" },
  { label: "Mobile App Development", href: "/services/mobile-app-development" },
  { label: "UI/UX Design", href: "/services/ui-ux-design" },
  { label: "SEO & Marketing", href: "/services/seo-marketing" },
];

const PRODUCTS_LINKS = [
  { label: "SewaCircle360 Store", href: "/products/sewacircle360" },
  { label: "School ERP System", href: "/products/school-erp" },
  { label: "Hospital ERP System", href: "/products/hospital-erp" },
  { label: "Business CRM Suite", href: "/products/crm" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Portfolio", href: "/portfolio" },
  { label: "Latest Blogs", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Academic Projects", href: "/student-training" },
  { label: "Internships", href: "/internships" },
  { label: "Contact Us", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      // Direct CRM Server Action integration for newsletter subscriptions
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-[#04081c] border-t border-border/80 pt-16 pb-8 transition-colors duration-300">
      {/* Decorative Gradient Background Highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Brand Introduction */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Logo size="md" />
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              SewaCircle360 Technologies is an enterprise-grade digital solutions agency. We build world-class custom software, SaaS products, and digital experiences that scale business operating ecosystems globally.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com/sewacircle360" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-slate-200/50 hover:bg-primary/10 text-slate-600 dark:bg-slate-800/40 dark:hover:bg-accent/10 dark:text-slate-300 dark:hover:text-accent rounded-full transition-colors duration-300 cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/sewacircle360" 
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-200/50 hover:bg-primary/10 text-slate-600 dark:bg-slate-800/40 dark:hover:bg-accent/10 dark:text-slate-300 dark:hover:text-accent rounded-full transition-colors duration-300 cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/sewacircle360" 
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-200/50 hover:bg-primary/10 text-slate-600 dark:bg-slate-800/40 dark:hover:bg-accent/10 dark:text-slate-300 dark:hover:text-accent rounded-full transition-colors duration-300 cursor-pointer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com/sewacircle360" 
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-200/50 hover:bg-primary/10 text-slate-600 dark:bg-slate-800/40 dark:hover:bg-accent/10 dark:text-slate-300 dark:hover:text-accent rounded-full transition-colors duration-300 cursor-pointer"
                aria-label="Instagram backup"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Products
            </h3>
            <ul className="flex flex-col gap-2">
              {PRODUCTS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Company
            </h3>
            <ul className="flex flex-col gap-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
                Support
              </h3>
              <ul className="flex flex-col gap-2.5">
                <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Mail className="h-4 w-4 text-primary dark:text-accent shrink-0" />
                  <a href="mailto:sewacircle360@gmail.com" className="hover:underline">
                    sewacircle360@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-primary dark:text-accent shrink-0 mt-0.5" />
                  <span>Remote Global / India</span>
                </li>
              </ul>
            </div>
            
            {/* Newsletter form */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  required
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-border/80 dark:border-slate-800 rounded-lg outline-none focus:border-primary dark:focus:border-accent text-foreground"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="p-2 bg-primary hover:bg-primary/95 text-white dark:bg-primary dark:hover:bg-primary/90 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
              
              {status === "success" && (
                <p className="text-xs text-green-500 font-medium">Successfully subscribed!</p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-500 font-medium">Subscription failed. Try again.</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Policy Links */}
        <div className="border-t border-border/60 dark:border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} SewaCircle360 Technologies. All rights reserved. Founded by Deepak.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
