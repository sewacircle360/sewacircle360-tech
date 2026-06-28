import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sewacircle360tech.online";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/portal/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
