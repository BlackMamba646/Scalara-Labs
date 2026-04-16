import { fetchStrapi } from "./strapi";
import { getStrapiImageUrl } from "./strapi-image";
import type { TeamMemberCms } from "./types/home";

interface TeamMembersSingleType {
  teamMembers: TeamMemberCms[] | null;
}

/**
 * Fetches team members from the /api/team-members single type and
 * resolves absolute photo URLs server-side (Client Components can't access CMS_URL).
 *
 * Returns `null` on failure so pages can fall back to the Team component's
 * hardcoded defaults.
 */
export async function fetchTeamMembers(): Promise<TeamMemberCms[] | null> {
  try {
    const data = await fetchStrapi<TeamMembersSingleType>(
      "/api/team-members?populate[teamMembers][populate]=*"
    );
    if (!data?.teamMembers) return null;
    return data.teamMembers.map((m) => ({
      ...m,
      desktopPhotoUrl: getStrapiImageUrl(m.desktopPhoto),
      mobilePhotoUrl: getStrapiImageUrl(m.mobilePhoto),
    }));
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return null;
  }
}
