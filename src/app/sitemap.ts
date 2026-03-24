import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                      lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/services`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/process`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/case-studies`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`,            lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/privacy`,         lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/cookies`,         lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/accessibility`,   lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/projects/greenhouse-iot`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const posts = getAllPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.modifiedDate ?? post.publishedDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
