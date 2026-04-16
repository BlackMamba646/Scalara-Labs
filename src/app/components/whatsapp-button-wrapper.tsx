import { fetchStrapi } from "@/lib/strapi";
import type { ContactData } from "@/lib/types/contact";
import WhatsAppButton from "./whatsapp-button";

export default async function WhatsAppButtonWrapper() {
  try {
    const data = await fetchStrapi<ContactData>("/api/contact?populate=*");
    if (!data?.whatsappLink) return null;
    return <WhatsAppButton href={data.whatsappLink} />;
  } catch (e) {
    console.error("Failed to fetch contact:", e);
    return null;
  }
}
