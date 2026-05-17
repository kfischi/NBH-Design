import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    { url: SITE_URL,                                   lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/services`,                     lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/process`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/case-studies`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/about`,                        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/cookies`,                      lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/accessibility`,                lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
