import type { StrapiImage } from "./strapi";

export interface BlogPostSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface BlogPostData {
  title: string;
  slug: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  heroImage: StrapiImage | null;
  seo: BlogPostSeo | null;
}
