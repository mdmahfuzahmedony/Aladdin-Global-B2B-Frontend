
import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    {
      url: "",
      priority: 1.0,
      changeFrequency: "daily" as const,
    },
    {
      url: "/about-us",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/products",
      priority: 0.9,
      changeFrequency: "daily" as const,
    },
    {
      url: "/categories",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/brands",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    {
      url: "/contact",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/certified",
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      url: "/privacy-policy",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      url: "/terms",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  return pages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
