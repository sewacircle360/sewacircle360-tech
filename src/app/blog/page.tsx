import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getBlogPosts } from "@/modules/blog/actions/blog";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_POSTS = [
  {
    id: "b1",
    title: "How to Design a Domain-Driven Design Modular Architecture in Next.js 15",
    slug: "ddd-modular-architecture-nextjs-15",
    excerpt: "Learn how to structure enterprise Next.js applications by isolating domains (CRM, Invoices, Products) into self-contained modules to achieve clean coupling.",
    category: "Software Architecture",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date("2026-06-25"),
    author: { name: "Deepak" },
    readingTime: 6
  },
  {
    id: "b2",
    title: "MongoDB Atlas Indexing Strategies for Enterprise Business OS",
    slug: "mongodb-atlas-indexing-strategies",
    excerpt: "Discover database optimization tricks to improve query speeds across normalized collections, compound index designs, and soft-delete index filters.",
    category: "Database Engineering",
    featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date("2026-06-20"),
    author: { name: "Deepak" },
    readingTime: 8
  },
  {
    id: "b3",
    title: "Best Practices for Securing NextAuth v5 in Production Router Environments",
    slug: "nextauth-v5-security-production",
    excerpt: "A deep dive into secure session token structures, CSRF cookie locks, RBAC validation middleware, and credential brute-force protection.",
    category: "Cybersecurity",
    featuredImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date("2026-06-12"),
    author: { name: "Security Team" },
    readingTime: 5
  }
];

export const metadata = {
  title: "Engineering Blog | SewaCircle360 Technologies",
  description: "Read professional tutorials, database optimization guides, and software engineering blueprints from the SewaCircle360 Technologies team.",
};

export default async function BlogPage() {
  const dbPosts = await getBlogPosts();
  const postsList = dbPosts.length > 0 ? dbPosts : DEFAULT_POSTS;

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-accent">
            Company Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
            The SewaCircle360 Engineering Blog
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Read engineering design patterns, system architecture analyses, and tech stack configuration articles written by our software developers.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsList.map((post: any, idx: number) => (
            <div 
              key={post.id || idx}
              className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-ccslate-850 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 group flex flex-col justify-between"
            >
              <div>
                {/* Visual Cover */}
                <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img 
                    src={post.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.max(1, Math.ceil((post.content || "").split(/\s+/).length / 200))} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1 line-clamp-2 group-hover:text-primary dark:group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Link */}
              <div className="px-6 pb-6 pt-0 mt-auto">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-accent hover:underline cursor-pointer"
                >
                  Read Full Article
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
