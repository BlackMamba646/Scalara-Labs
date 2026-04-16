import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchStrapi } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi-image';
import type { BlogPostData } from '@/lib/types/blog-post';
import type { GlobalData } from '@/lib/types/global';

import Header from '@/components/shared/Header/Header';
import BlogPostHero from '@/page-sections/BlogPostPage/sections/BlogPostHero/BlogPostHero';
import BlogPostContent from '@/page-sections/BlogPostPage/sections/BlogPostContent/BlogPostContent';
import Cta from '@/components/shared/Cta/Cta';
import Footer from '@/components/shared/Footer/Footer';

async function getBlogPost(slug: string) {
  const posts = await fetchStrapi<BlogPostData[]>(
    `/api/blog-posts?filters[slug]=${slug}&populate[heroImage]=true&populate[seo]=true`
  );
  return posts?.[0] ?? null;
}

export async function generateStaticParams() {
  try {
    const posts = await fetchStrapi<BlogPostData[]>(
      '/api/blog-posts?populate=*&sort=date:desc'
    );
    return (posts ?? []).map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return {
    title: post.seo?.metaTitle ?? post.title ?? 'Blog | Scalara Labs',
    description:
      post.seo?.metaDescription ??
      post.excerpt ??
      'Read our latest insights on software development.',
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, globalData] = await Promise.all([
    getBlogPost(slug),
    fetchStrapi<GlobalData>('/api/global?populate[services][populate]=*').catch(() => null),
  ]);
  if (!post) notFound();

  return (
    <>
      <Header services={globalData?.services} />
      <BlogPostHero
        title={post.title}
        author={post.author ?? undefined}
        date={post.date ?? undefined}
        heroImageUrl={getStrapiImageUrl(post.heroImage) ?? undefined}
      />
      <BlogPostContent content={post.content ?? undefined} />
      <Cta variant="light" />
      <Footer />
    </>
  );
}
