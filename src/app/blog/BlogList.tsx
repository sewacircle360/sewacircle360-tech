"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, User, Clock, ArrowRight, Search, BookOpen, Tag } from "lucide-react";
import { motion } from "framer-motion";

export function BlogList({ initialPosts }: { initialPosts: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Gather unique categories dynamically
  const categories = ["All", ...Array.from(new Set(initialPosts.map((post) => post.category)))];

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 mb-12">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900/30 border dark:border-slate-800 rounded-3xl">
          <BookOpen className="h-10 w-10 text-slate-350 mx-auto mb-3" />
          <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Articles Found</span>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2">
            No articles match your selection. Try adjusting your search query or choosing another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.div
              layout
              key={post.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-350 group flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img 
                    src={post.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3.5 text-left">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {Math.max(1, Math.ceil((post.content || "").split(/\s+/).length / 200))} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1 line-clamp-2 leading-snug group-hover:text-primary dark:group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt || (post.content && post.content.substring(0, 120) + "...")}
                  </p>
                </div>
              </div>

              {/* Tags and CTA */}
              <div className="px-6 pb-6 pt-0 border-t border-slate-50 dark:border-slate-850 mt-auto">
                <div className="flex flex-wrap gap-1 pt-4 mb-4">
                  {post.tags && post.tags.slice(0, 3).map((tag: string, tIdx: number) => (
                    <span 
                      key={tIdx} 
                      className="text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1 border border-border/10"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                </div>

                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-accent hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
