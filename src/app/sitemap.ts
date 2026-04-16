import type { MetadataRoute } from 'next';
import { fetchStrapi } from '@/lib/strapi';

type StrapiSlug = { slug: string; updatedAt?: string };

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/',                     changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/about-us',             changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services',             changeFrequency: 'weekly',  priority: 0.9 },
  { path: '/blog',                 changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/lead-magnet',          changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy-policy',       changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/terms-and-conditions', changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/cookie-policy',        changeFrequency: 'yearly',  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let services: StrapiSlug[] = [];
  let posts: StrapiSlug[] = [];

  try {
    services = await fetchStrapi<StrapiSlug[]>(
      '/api/services?fields[0]=slug&fields[1]=updatedAt'
    );
  } catch {
    // Swallow — sitemap should still build if CMS is unavailable.
  }

  try {
    posts = await fetchStrapi<StrapiSlug[]>(
      '/api/blog-posts?fields[0]=slug&fields[1]=updatedAt&sort=date:desc'
    );
  } catch {
    // Swallow — sitemap should still build if CMS is unavailable.
  }

  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...postEntries];
}
