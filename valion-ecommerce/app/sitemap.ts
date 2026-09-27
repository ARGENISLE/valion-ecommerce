import { supabase } from "@/lib/supabase";
import type { MetadataRoute } from "next";

const SITE_URL = "https://valion-ecommerce.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: productos } = await supabase.from("productos").select("id");

  const paginasProductos: MetadataRoute.Sitemap = (productos ?? []).map((p) => ({
    url: `${SITE_URL}/productos/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...paginasProductos,
  ];
}
