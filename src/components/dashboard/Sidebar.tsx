"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard,
  Users,
  Target,
  Briefcase,
  Layers,
  Wrench,
  FolderHeart,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Receipt,
  FileText,
  FileCheck2,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Activity,
  Award,
  GraduationCap
} from "lucide-react";

// Sidebar Links categorized by logical business function
const NAV_GROUPS = [
  {
    title: "Core Operations",
    links: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Leads CRM", href: "/admin/crm", icon: Target },
      { label: "Clients Directory", href: "/admin/clients", icon: Users },
      { label: "Employees Directory", href: "/admin/employees", icon: ShieldCheck },
      { label: "Students Directory", href: "/admin/students", icon: GraduationCap },
      { label: "Academic Requests", href: "/admin/academic-requests", icon: Award },
      { label: "Projects Pipeline", href: "/admin/projects", icon: Briefcase },
    ]
  },
  {
    title: "Document Vault",
    links: [
      { label: "Invoices", href: "/admin/invoices", icon: Receipt },
      { label: "Quotations", href: "/admin/quotations", icon: FileText },
      { label: "Agreements", href: "/admin/agreements", icon: FileCheck2 },
    ]
  },
  {
    title: "Corporate CMS",
    links: [
      { label: "Products Catalog", href: "/admin/products", icon: Layers },
      { label: "Services Builder", href: "/admin/services", icon: Wrench },
      { label: "Portfolio Grid", href: "/admin/portfolio", icon: FolderHeart },
      { label: "Careers Manager", href: "/admin/careers", icon: Briefcase },
      { label: "Company Blog", href: "/admin/blog", icon: BookOpen },
    ]
  },
  {
    title: "Administrative",
    links: [
      { label: "Meetings Calendar", href: "/admin/meetings", icon: Calendar },
      { label: "My Profile", href: "/admin/profile", icon: ShieldCheck },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Audit Trails", href: "/admin/audit", icon: Activity },
      { label: "System Config", href: "/admin/settings", icon: Settings },
    ]
  }
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole = (session?.user as any)?.role;
  const isEmployee = userRole === "EMPLOYEE";

  const visibleNavGroups = NAV_GROUPS.map((group) => {
    const allowedLinks = group.links.filter((link) => {
      if (isEmployee) {
        const employeePaths = [
          "/admin", 
          "/admin/projects", 
          "/admin/meetings", 
          "/admin/profile"
        ];
        return employeePaths.includes(link.href);
      }
      return true;
    });

    return {
      ...group,
      links: allowedLinks
    };
  }).filter((group) => group.links.length > 0);

  // Load collapse state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

  return (
    <aside 
      className={`relative h-screen bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header / Brand Logo */}
      <div className={`p-5 flex items-center justify-between border-b border-slate-800 ${isCollapsed ? "justify-center" : ""}`}>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold font-display text-white">
              S
            </div>
            <span className="font-bold tracking-tight text-white font-display">
              SewaCircle360<span className="text-accent">OS</span>
            </span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold font-display text-white">
            S
          </div>
        )}
        
        {/* Toggle Button */}
        <button 
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer shadow-md"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Filter / Search Box (Only when expanded) */}
      {!isCollapsed && (
        <div className="px-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search sections..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-800 hover:border-slate-700 focus:border-slate-600 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      )}

      {/* Sidebar Links Scrollable Wrapper */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5 scrollbar-thin">
        {visibleNavGroups.map((group) => {
          // Filter links based on quick search query
          const filteredLinks = group.links.filter(link => 
            link.label.toLowerCase().includes(filterQuery.toLowerCase())
          );

          if (filteredLinks.length === 0) return null;

          return (
            <div key={group.title} className="flex flex-col gap-1.5">
              {!isCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2.5 mb-1 block">
                  {group.title}
                </span>
              )}
              
              <ul className="flex flex-col gap-1">
                {filteredLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group relative ${
                          isActive 
                            ? "bg-primary text-white" 
                            : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                        }`} />
                        
                        {!isCollapsed && <span>{link.label}</span>}
                        
                        {/* Tooltip on collapse hover */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-4 px-2 py-1 text-xs font-semibold bg-slate-900 border border-slate-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                            {link.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* User Session Profile & Sign Out Actions */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
        <Link 
          href="/admin/profile"
          className={`flex items-center gap-3 hover:bg-slate-800/40 p-1.5 rounded-xl transition-colors cursor-pointer w-full ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 shrink-0 uppercase">
            {session?.user?.name ? session.user.name.substring(0, 2) : "AD"}
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-sm font-semibold text-white truncate block">
                {session?.user?.name || "Administrator"}
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase block truncate">
                {(session?.user as any)?.role || "Super Admin"}
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer w-full justify-start ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
