import type { Metadata } from 'next';
import { fetchStrapi } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi-image';
import type { BlogListingPageData, BlogPostCms } from '@/lib/types/blog';
import type { GlobalData } from '@/lib/types/global';

import Header from '@/components/shared/Header/Header';
import BlogHero from '@/page-sections/BlogListing/sections/BlogHero/BlogHero';
import BlogCards from '@/page-sections/BlogListing/sections/BlogCards/BlogCards';
import Services from '@/components/shared/Services/Services';
import Cta from '@/components/shared/Cta/Cta';
import Footer from '@/components/shared/Footer/Footer';

async function getBlogData() {
  try {
    const [pageData, posts, globalData] = await Promise.all([
      fetchStrapi<BlogListingPageData>('/api/blog-listing-page?populate=*'),
      fetchStrapi<BlogPostCms[]>('/api/blog-posts?populate[heroImage]=true&populate[seo]=true&sort=date:desc'),
      fetchStrapi<GlobalData>('/api/global?populate[services][populate]=*'),
    ]);
    return { pageData, posts, globalData };
  } catch {
    return { pageData: null, posts: null, globalData: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchStrapi<BlogListingPageData>('/api/blog-listing-page?populate=*');
    return {
      title: data.seo?.metaTitle ?? 'Blog | Scalara Labs',
      description: data.seo?.metaDescription ?? 'Practical insights on architecture, performance, and product decisions.',
    };
  } catch {
    return {
      title: 'Blog | Scalara Labs',
      description: 'Practical insights on architecture, performance, and product decisions.',
    };
  }
}

export default async function BlogListingPage() {
  const { pageData, posts, globalData } = await getBlogData();

  return (
    <main>
      <Header services={globalData?.services} />
      <BlogHero
        caption={pageData?.heroCaption ?? undefined}
        titleLight={pageData?.heroTitleLight ?? undefined}
        titleAccent={pageData?.heroTitleAccent ?? undefined}
        subtitle={pageData?.heroSubtitle ?? undefined}
      />
      <BlogCards posts={posts?.map(p => ({
        ...p,
        heroImageUrl: getStrapiImageUrl(p.heroImage),
      })) ?? undefined} />
      <Services services={globalData?.services ?? undefined} />
      <Cta variant="light" />
      <Footer />
    </main>
  );
}
