import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { getBlogPostBySlug } from "@/modules/blog/actions/blog";
import { Calendar, User, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const DEFAULT_POSTS = [
  {
    id: "b1",
    title: "How to Design a Domain-Driven Design Modular Architecture in Next.js 15",
    slug: "ddd-modular-architecture-nextjs-15",
    excerpt: "Learn how to structure enterprise Next.js applications by isolating domains (CRM, Invoices, Products) into self-contained modules to achieve clean coupling.",
    category: "Software Architecture",
    content: `
# Introduction

When building enterprise-grade software platforms, maintaining a clean codebase becomes increasingly difficult as the number of features grows. Tight coupling between components often leads to situations where changing code in the CRM breaks billing or client settings.

To prevent this, we adopt a **Domain-Driven Design (DDD) inspired modular architecture**.

## The Core Concept

In a DDD-inspired modular architecture, each business domain remains entirely self-contained. For example, instead of dumping all Server Actions into a single directory, we bundle everything relevant to the **Invoices** domain directly inside \`src/modules/invoices/\`:

- **\`actions/\`**: Holds only billing and transactional Server Actions.
- **\`components/\`**: Houses itemization rows, invoice templates, and payment cards.
- **\`schemas/\`**: Defines Zod schemas specific to billing validation.
- **\`types/\`**: Manages billing interfaces.

## Why This Matters

1. **Extensibility**: You can plug in a new "Hospital ERP" or "HRMS" module in the future by simply adding a directory in \`src/modules/hospital-erp/\` without modifying the core project architecture.
2. **De-coupling**: Modules communicate over clean interfaces rather than direct references.
3. **Productivity**: Developers can focus on a single domain folder without getting lost in global directory structures.
    `,
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80",
    createdAt: new Date("2026-06-25"),
    author: { name: "Deepak" },
    readingTime: 6,
    tags: ["Next.js", "DDD", "Architecture", "TypeScript"]
  },
  {
    id: "b2",
    title: "MongoDB Atlas Indexing Strategies for Enterprise Business OS",
    slug: "mongodb-atlas-indexing-strategies",
    excerpt: "Discover database optimization tricks to improve query speeds across normalized collections, compound index designs, and soft-delete index filters.",
    category: "Database Engineering",
    content: `
# Boosting Database Performance

In database-driven applications like a CRM or ERP system, query latency directly impacts user experience. When loading pages, sorting leads, or filtering client invoices, we must optimize how Prisma interacts with MongoDB Atlas.

## 1. Single and Compound Indexes

By default, querying fields like \`email\` or \`clientId\` causes a full collection scan if indexes aren't configured.

In Prisma, you can define indexes directly in your \`schema.prisma\` model block:

\`\`\`prisma
model Lead {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  email  String
  status String
  
  @@index([email])
  @@index([status, email])
}
\`\`\`

Compound indexes are vital when executing filter grids in the CRM Kanban view.

## 2. Managing Soft Deletes

In enterprise systems, we rarely delete records permanently. Instead, we use soft-deletes via a \`deletedAt\` timestamp field. To ensure that checking \`deletedAt == null\` doesn't degrade performance, ensure this field is indexed alongside active query parameters.
    `,
    featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80",
    createdAt: new Date("2026-06-20"),
    author: { name: "Deepak" },
    readingTime: 8,
    tags: ["MongoDB", "Database", "Prisma", "Atlas"]
  }
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staticPost = DEFAULT_POSTS.find((p) => p.slug === slug);
  if (staticPost) {
    return { title: `${staticPost.title} | SewaCircle360 Tech Blog` };
  }
  const dbPost = await getBlogPostBySlug(slug);
  if (dbPost) {
    return { title: `${dbPost.title} | SewaCircle360 Tech Blog` };
  }
  return { title: "Blog Article | SewaCircle360 Technologies" };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Find static or database post
  const staticPost = DEFAULT_POSTS.find((p) => p.slug === slug);
  const dbPost = !staticPost ? await getBlogPostBySlug(slug) : null;
  const post = staticPost || dbPost;

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-32 pb-24 bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary dark:hover:text-accent mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          {/* Article Header */}
          <article className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-accent bg-primary/5 dark:bg-accent/5 px-3 py-1 rounded-full border border-primary/10 dark:border-accent/10">
                {post.category}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {Math.max(1, Math.ceil((post.content || "").split(/\s+/).length / 200))} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-900 dark:text-white leading-tight">
              {post.title}
            </h1>

            {/* Author / Date */}
            <div className="flex items-center gap-6 border-y border-border/60 dark:border-slate-800/80 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary dark:text-accent" />
                By {post.author?.name || "Team Member"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary dark:text-accent" />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="h-80 sm:h-[400px] w-full rounded-2xl overflow-hidden border border-border/80 shadow-md">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content Markdown/RichText representation */}
            <div className="prose prose-slate dark:prose-invert max-w-none pt-4 text-cslate-650 dark:text-slate-300 leading-relaxed space-y-6">
              {post.content.split("\n\n").map((para: string, idx: number) => {
                if (para.startsWith("# ")) {
                  return (
                    <h2 key={idx} className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-8 mb-4">
                      {para.replace("# ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("## ")) {
                  return (
                    <h3 key={idx} className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-6 mb-3">
                      {para.replace("## ", "")}
                    </h3>
                  );
                }
                if (para.startsWith("1. ") || para.startsWith("- ")) {
                  return (
                    <ul key={idx} className="list-disc list-inside pl-4 space-y-2">
                      {para.split("\n").map((li, liIdx) => (
                        <li key={liIdx} className="text-sm sm:text-base">
                          {li.replace(/^[0-9\-*.\s]+/, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-sm sm:text-base">
                    {para.trim()}
                  </p>
                );
              })}
            </div>

            {/* Tags footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 dark:border-slate-800/80 pt-6 mt-8">
                <Tag className="h-4 w-4 text-cslate-450 shrink-0" />
                {post.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-cslate-350 rounded-lg border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
