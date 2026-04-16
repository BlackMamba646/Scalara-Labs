import { fetchStrapi } from "@/lib/strapi";
import type { ContactData } from "@/lib/types/contact";
import ScalaraChat from "./ScalaraChat";

export default async function ScalaraChatWrapper() {
  let whatsappHref: string | undefined;

  try {
    const data = await fetchStrapi<ContactData>("/api/contact?populate=*");
    whatsappHref = data?.whatsappLink || undefined;
  } catch (e) {
    console.error("Failed to fetch contact for chat widget:", e);
  }

  return <ScalaraChat whatsappHref={whatsappHref} />;
}
