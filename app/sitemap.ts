import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const BASE = 'https://powamekka.com';

const services = ['audit', 'systemes', 'ia', 'sites', 'formation'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/offres`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/vision`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    ...services.map((s) => ({
      url: `${BASE}/services/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
