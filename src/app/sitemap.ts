import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sewacircle360tech.online";
  
  // Core marketing routes
  const routes = [
    "",
    "/about",
    "/services",
    "/products",
    "/portfolio",
    "/blog",
    "/careers",
    "/contact",
    "/book-meeting"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes];
}
