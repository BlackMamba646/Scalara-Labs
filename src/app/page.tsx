import { fetchStrapi } from "@/lib/strapi";
import { getStrapiImageUrl } from "@/lib/strapi-image";
import { fetchTeamMembers } from "@/lib/team-members";
import HomeClient from "./home-client";
import type { HomePageData } from "@/lib/types/home";
import type { GlobalData } from "@/lib/types/global";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchStrapi<HomePageData>("/api/home-page?populate=*");
    return {
      title: data.seo?.metaTitle ?? "Scalara Labs",
      description:
        data.seo?.metaDescription ??
        "Senior Software Engineers. Startup Speed. Enterprise Quality.",
    };
  } catch {
    return {
      title: "Scalara Labs",
      description:
        "Senior Software Engineers. Startup Speed. Enterprise Quality.",
    };
  }
}

export default async function Home() {
  const [rawHomeData, globalData, teamMembers] = await Promise.all([
    fetchStrapi<HomePageData>(
      "/api/home-page?populate[heroTechLogos][populate]=*&populate[whyChooseCards]=true&populate[ctaOverrides]=true&populate[seo]=true"
    ).catch((error) => {
      console.error("Failed to fetch home page:", error);
      return null;
    }),
    fetchStrapi<GlobalData>("/api/global?populate[services][populate]=*").catch((error) => {
      console.error("Failed to fetch global data:", error);
      return null;
    }),
    fetchTeamMembers(),
  ]);

  // Resolve image URLs server-side (client components can't access CMS_URL)
  const homeData = rawHomeData
    ? {
        ...rawHomeData,
        heroTechLogos:
          rawHomeData.heroTechLogos?.map((l) => ({
            ...l,
            logo: l.logo
              ? { ...l.logo, url: getStrapiImageUrl(l.logo) || l.logo.url }
              : undefined,
          })) ?? null,
      }
    : null;

  return (
    <HomeClient
      homeData={homeData}
      services={globalData?.services ?? null}
      teamMembers={teamMembers}
    />
  );
}
