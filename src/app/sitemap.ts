
import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aladdinglobal.com";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:2001";

type SitemapItem = {
  slug?: string;
  updatedAt?: string;
  status?: string;
};

async function fetchItems(
  endpoint: string
): Promise<SitemapItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const result = await response.json();

    if (Array.isArray(result)) return result;

    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.products)) return result.products;
    if (Array.isArray(result.categories)) return result.categories;

    return [];
  } catch (error) {
    console.error("Sitemap API Error:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about-us`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/help`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/payment-methods`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const [products, categories] = await Promise.all([
    fetchItems("/api/products"),
    fetchItems("/api/categories"),
  ]);

  const productPages: MetadataRoute.Sitemap = products
    .filter(
      (product) =>
        product.slug &&
        (!product.status || product.status === "ACTIVE")
    )
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => category.slug)
    .map((category) => ({
      url: `${SITE_URL}/categories/${category.slug}`,
      lastModified: category.updatedAt
        ? new Date(category.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}
