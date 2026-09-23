import type { MetadataRoute } from "next";
import { industrySlugs } from "@/content/industries";
import { getPosts } from "@/lib/blog";
import { getServiceSlugs } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPosts();
  const serviceSlugs = await getServiceSlugs();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...serviceSlugs.map((slug) => ({
      url: `${siteUrl}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...industrySlugs.map((slug) => ({
      url: `${siteUrl}/industries/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/clients`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}

export const revalidate = 300;
