"use client";

import { useState, useEffect, useTransition } from "react";
import { createBlogPost, getBlogPosts, deleteBlogPost } from "@/modules/blog/actions/blog";
import { useSession } from "next-auth/react";
import { BookOpen, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, Calendar } from "lucide-react";

export default function AdminBlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Software Engineering",
    featuredImage: "",
    tagsText: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPosts = async () => {
    const list = await getBlogPosts();
    setPosts(list);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.slug || !formData.content) {
      setError("Title, slug, and content are required.");
      return;
    }

    const tags = formData.tagsText
      ? formData.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const featuredImage = formData.featuredImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

    const authorId = session?.user?.id;
    if (!authorId) {
      setError("Authentication error. Please re-login to publish articles.");
      return;
    }

    startTransition(async () => {
      const result = await createBlogPost({
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featuredImage,
        authorId,
        category: formData.category,
        tags,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Blog post published successfully!");
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "Software Engineering",
          featuredImage: "",
          tagsText: ""
        });
        fetchPosts();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const result = await deleteBlogPost(id);
    if (result.error) {
      alert(result.error);
    } else {
      fetchPosts();
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white leading-none">
          Company Blog CMS
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Publish dynamic engineering insights, tutorials, and security checklists on the public blog index page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Publish New Post</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Post Title</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="How to Secure Next.js Server Actions"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</label>
                <input 
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="secure-nextjs-server-actions"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
                <input 
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Cybersecurity"
                  disabled={isPending}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Featured Image URL</label>
              <input 
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tags (comma-separated)</label>
              <input 
                type="text"
                value={formData.tagsText}
                onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                placeholder="security, actions, nextjs"
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Excerpt / Brief Summary</label>
              <input 
                type="text"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A deep dive into secure tokens and middleware constraints..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Content Mark</label>
              <textarea 
                rows={6}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article details here..."
                disabled={isPending}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/80 border border-border/80 dark:border-slate-800 rounded-xl outline-none text-foreground focus:border-primary placeholder:text-slate-450 resize-none font-mono"
              />
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Publish Article
            </button>
          </form>
        </div>

        {/* Right Side Articles List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#090d1f]/60 border dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="h-8 w-8 text-slate-350 mx-auto mb-2" />
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">No Custom Articles</span>
              <p className="text-xs text-slate-500 mt-1">Default mock articles are shown on the index. Added posts will show up next to them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Article</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-slate-800/60">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex flex-col gap-0.5">
                          <span>{post.title}</span>
                          <span className="text-xs text-slate-400 font-normal flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">{post.category}</td>
                      <td className="py-4 px-6 text-xs text-slate-450">{post.author?.name || "Team"}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          aria-label="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
