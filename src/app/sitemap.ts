import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sewacircle360tech.online";
  
  // Core marketing routes
  const corePaths = [
    "",
    "/about",
    "/services",
    "/products",
    "/portfolio",
    "/blog",
    "/careers",
    "/student-training",
    "/internships",
    "/contact",
    "/book-meeting"
  ];

  const routes = corePaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Blog Posts
  let blogRoutes: any[] = [];
  try {
    const posts = await db.blogPost.findMany({
      select: { slug: true, updatedAt: true }
    });
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap dynamic blogs query failed:", error);
  }

  return [...routes, ...blogRoutes];
}
