import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getBlogPosts } from "@/modules/blog/actions/blog";
import { BlogList } from "./BlogList";

const DEFAULT_POSTS = [
  {
    id: "b1",
    title: "How to Design a Domain-Driven Design Modular Architecture in Next.js 16",
    slug: "ddd-modular-architecture-nextjs-16",
    excerpt: "Learn how to structure enterprise Next.js applications by isolating domains (CRM, Invoices, Products) into self-contained modules to achieve clean coupling.",
    category: "Software Architecture",
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date("2026-06-25"),
    author: { name: "Deepak" },
    content: "Domain-Driven Design (DDD) partitions complex codebases into separate domains, making next-gen application architectures robust and easy to update.",
    tags: ["nextjs", "architecture", "typescript"]
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
    content: "Efficient indexes avoid expensive COLLSCAN scans. Learn index properties, compound design configurations, and sparse constraints.",
    tags: ["mongodb", "database", "performance"]
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
    content: "NextAuth v5 session storage settings, JWT encryption keys, CSRF checks, and role permission verifications in middleware configurations.",
    tags: ["security", "auth", "nextauth"]
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

        <BlogList initialPosts={postsList} />
      </main>
      <Footer />
    </>
  );
}
