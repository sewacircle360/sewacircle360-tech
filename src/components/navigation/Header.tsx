"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, Search, Calendar, ArrowRight, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const pathname = usePathname();
  const router = useRouter();

  // Scroll listener to trigger shrink and glassmorphism state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setIsDropdownOpen(false);
      setIsMobileDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const isStudentActive = pathname === "/student-training" || pathname === "/internships";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "h-16 glass-card shadow-sm border-b"
            : "h-20 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size={isScrolled ? "sm" : "md"} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-primary dark:text-accent"
                      : "text-[#334155] dark:text-[#cbd5e1] hover:text-primary dark:hover:text-accent"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary dark:bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Desktop Student Programs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 relative py-1 cursor-pointer outline-none ${
                  isStudentActive
                    ? "text-primary dark:text-accent"
                    : "text-[#334155] dark:text-[#cbd5e1] hover:text-primary dark:hover:text-accent"
                }`}
              >
                <span>Student Programs</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                {isStudentActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary dark:bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-lg p-2 z-50"
                  >
                    <Link
                      href="/student-training"
                      className={`block px-4 py-2.5 text-sm rounded-xl transition-colors ${
                        pathname === "/student-training"
                          ? "bg-slate-100 dark:bg-slate-800 text-primary dark:text-accent font-semibold"
                          : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      Academic Projects
                    </Link>
                    <Link
                      href="/internships"
                      className={`block px-4 py-2.5 text-sm rounded-xl transition-colors mt-0.5 ${
                        pathname === "/internships"
                          ? "bg-slate-100 dark:bg-slate-800 text-primary dark:text-accent font-semibold"
                          : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-855"
                      }`}
                    >
                      Internships
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop Action Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-full transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Controller */}
            <ThemeToggle />

            {/* Login Button */}
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              Login
            </Link>

            {/* Book Meeting Button */}
            <Link
              href="/book-meeting"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/95 dark:bg-primary dark:hover:bg-primary/90 rounded-full transition-all duration-300 shadow-sm shadow-primary/20 hover:scale-[1.02] cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              Book Meeting
            </Link>
          </div>

          {/* Mobile Right Bar controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-ccslate-850 rounded-full transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <ThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Animated Mobile Menu (Framer Motion Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-45 w-72 max-w-full bg-background border-l border-border/80 shadow-xl px-6 pt-24 pb-8 flex flex-col justify-between lg:hidden"
            >
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-medium px-2 py-1.5 rounded-lg transition-colors ${
                        isActive
                          ? "text-primary dark:text-accent bg-primary/5 dark:bg-accent/5 font-semibold"
                          : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Student Programs Dropdown */}
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className={`flex items-center justify-between w-full text-lg font-medium px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isStudentActive
                        ? "text-primary dark:text-accent bg-primary/5 dark:bg-accent/5 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent"
                    }`}
                  >
                    <span>Student Programs</span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isMobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isMobileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 flex flex-col gap-2 mt-1.5 overflow-hidden"
                      >
                        <Link
                          href="/student-training"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`text-base px-2 py-1 rounded-lg transition-colors ${
                            pathname === "/student-training"
                              ? "text-primary dark:text-accent font-semibold"
                              : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent"
                          }`}
                        >
                          Academic Projects
                        </Link>
                        <Link
                          href="/internships"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`text-base px-2 py-1 rounded-lg transition-colors ${
                            pathname === "/internships"
                              ? "text-primary dark:text-accent font-semibold"
                              : "text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent"
                          }`}
                        >
                          Internships
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Login Portal
                </Link>
                <Link
                  href="/book-meeting"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 font-semibold text-white bg-primary rounded-xl shadow-lg shadow-primary/20"
                >
                  <Calendar className="h-4 w-4" />
                  Book Meeting
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 flex items-start justify-center pt-24 px-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md"
          >
            {/* Modal clickout zone */}
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
            
            {/* Search Card */}
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl p-4 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles, services, products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground py-2 text-base focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-border shrink-0"
                >
                  ESC
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
