import { MetadataRoute } from 'next';
import { execSync } from 'child_process';
import { getAllPosts } from '@/lib/posts';

const BASE = 'https://www.powamekka.com';

const services = ['audit', 'systemes', 'ia', 'sites', 'formation'];

// Dernier commit connu avant l'introduction de cette fonction : utilisé comme
// repli si `git log` échoue (environnement sans historique), plutôt que de
// mentir avec la date du build.
const FALLBACK_DATE = new Date('2026-09-04T00:00:00Z');

function lastCommitDate(relativePath: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%cI -- ${relativePath}`, {
      cwd: process.cwd(),
      encoding: 'utf8',
    }).trim();
    return iso ? new Date(iso) : FALLBACK_DATE;
  } catch {
    return FALLBACK_DATE;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: lastCommitDate('app/page.tsx'), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/offres`, lastModified: lastCommitDate('app/offres/page.tsx'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: lastCommitDate('app/faq/page.tsx'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: lastCommitDate('app/blog/page.tsx'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/vision`, lastModified: lastCommitDate('app/vision/page.tsx'), changeFrequency: 'yearly', priority: 0.6 },
    ...services.map((s) => ({
      url: `${BASE}/services/${s}`,
      lastModified: lastCommitDate(`app/services/${s}/page.tsx`),
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
