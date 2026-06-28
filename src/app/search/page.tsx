import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getBlogPosts } from "@/modules/blog/actions/blog";
import { getProducts } from "@/modules/products/actions/products";
import { Search, ArrowRight, BookOpen, Layers, Settings } from "lucide-react";
import Link from "next/link";

interface SearchProps {
  searchParams: Promise<{ q?: string }>;
}

const SERVICES = [
  { title: "Website Development", slug: "website-development", desc: "Responsive marketing sites using Next.js & Tailwind CSS." },
  { title: "Software Development", slug: "software-development", desc: "Custom business backend portals, CRM, and ERP modules." },
  { title: "Mobile App Development", slug: "mobile-app-development", desc: "Cross-platform native iOS & Android applications." },
  { title: "UI UX Design", slug: "ui-ux-design", desc: "Premium prototypes, layouts, typography, and logo systems." },
  { title: "SEO & Digital Marketing", slug: "seo-marketing", desc: "SEO schemas, robots configurations, and leads collection pipelines." },
];

export const metadata = {
  title: "Search Results | SewaCircle360 Technologies",
};

export default async function SearchPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  const query = (params.q || "").toLowerCase().trim();

  // Fetch blogs & products to search within
  const blogs = await getBlogPosts();
  const products = await getProducts();

  // Safe checks for empty DBs fallback arrays
  const searchBlogs = blogs.length > 0 ? blogs : [
    { title: "How to Design a Domain-Driven Design Modular Architecture in Next.js 15", slug: "ddd-modular-architecture-nextjs-15", category: "Software Architecture" },
    { title: "MongoDB Atlas Indexing Strategies for Enterprise Business OS", slug: "mongodb-atlas-indexing-strategies", category: "Database Engineering" }
  ];

  const searchProducts = products.length > 0 ? products : [
    { name: "SewaCircle360 Suite", slug: "sewacircle360", category: "CRM & ERP" },
    { name: "School ERP Core", slug: "school-erp", category: "Education Software" },
    { name: "Hospital ERP Core", slug: "hospital-erp", category: "Healthcare Software" }
  ];

  // Filter items
  const matchedBlogs = query 
    ? searchBlogs.filter(b => b.title.toLowerCase().includes(query)) 
    : [];
  
  const matchedProducts = query 
    ? searchProducts.filter(p => p.name.toLowerCase().includes(query)) 
    : [];

  const matchedServices = query 
    ? SERVICES.filter(s => s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)) 
    : [];

  const totalResults = matchedBlogs.length + matchedProducts.length + matchedServices.length;

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Search className="h-6 w-6 text-primary dark:text-accent" />
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Search Results
            </h1>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl mb-8">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Found <span className="font-bold text-slate-800 dark:text-white">{totalResults}</span> matches for query: <span className="font-semibold text-primary dark:text-accent">"{query}"</span>
            </p>
          </div>

          {totalResults === 0 ? (
            <div className="py-16 text-center border border-dashed rounded-2xl bg-white dark:bg-slate-900">
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                No matching articles, products, or services found. Try another keyword.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Services matches */}
              {matchedServices.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Services ({matchedServices.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {matchedServices.map((srv) => (
                      <Link 
                        key={srv.slug}
                        href={`/services#${srv.slug}`}
                        className="p-4 bg-white hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900 border rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-accent text-sm sm:text-base font-display">
                            {srv.title}
                          </h4>
                          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
                            {srv.desc}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products matches */}
              {matchedProducts.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Products ({matchedProducts.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {matchedProducts.map((prod) => (
                      <Link 
                        key={prod.slug}
                        href="/products"
                        className="p-4 bg-white hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900 border rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-accent text-sm sm:text-base font-display">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {prod.category}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog matches */}
              {matchedBlogs.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Blog Articles ({matchedBlogs.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {matchedBlogs.map((post) => (
                      <Link 
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="p-4 bg-white hover:bg-slate-100/50 dark:bg-slate-900/40 dark:hover:bg-slate-900 border rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-accent text-sm sm:text-base font-display">
                            {post.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            {post.category}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
