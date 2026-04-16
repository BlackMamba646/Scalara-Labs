const CMS_URL = process.env.CMS_URL || "http://localhost:1337";
const CMS_API = process.env.CMS_API;

export async function fetchStrapi<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${CMS_API}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}
