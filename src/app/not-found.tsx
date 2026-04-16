import type { Metadata } from 'next';
import Header from '@/components/shared/Header/Header';
import Footer from '@/components/shared/Footer/Footer';
import Hero from '@/page-sections/NotFound/sections/Hero/Hero';
import Error404Background from '@/page-sections/NotFound/sections/Error404Background/Error404Background';

export const metadata: Metadata = {
  title: 'Page not found | Scalara Labs',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      <Header />
      <Hero />
      <Error404Background />
      <Footer />
    </main>
  );
}
