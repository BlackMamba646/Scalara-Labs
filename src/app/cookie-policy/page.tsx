import type { Metadata } from 'next';
import Header from '@/components/shared/Header/Header';
import Footer from '@/components/shared/Footer/Footer';
import LegalContent from '@/page-sections/Legal/sections/LegalContent/LegalContent';
import type { StrapiBlock } from '@/page-sections/Legal/sections/LegalContent/LegalContent';
import { fetchStrapi } from '@/lib/strapi';
import type { GlobalData } from '@/lib/types/global';

interface LegalPageData {
  Title: string;
  Content: StrapiBlock[];
  lastUpdated: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cookie Policy | Scalara Labs',
    description: 'Scalara Labs cookie policy.',
  };
}

export default async function CookiePolicyPage() {
  const [data, globalData] = await Promise.all([
    fetchStrapi<LegalPageData>('/api/cookie-policy?populate=*').catch(() => null),
    fetchStrapi<GlobalData>('/api/global?populate[services][populate]=*').catch(() => null),
  ]);

  return (
    <main>
      <Header variant="light" services={globalData?.services} />
      <LegalContent
        title={data?.Title ?? 'Cookie Policy'}
        content={data?.Content}
        lastUpdated={data?.lastUpdated}
      />
      <Footer />
    </main>
  );
}
