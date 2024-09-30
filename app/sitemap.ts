import supabase from "@/utils/supabase";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

  const { data, error } = await supabase.from("initiatives").select("id");

  let initiatives: MetadataRoute.Sitemap = [];

  if (!error) {
    initiatives = data.map((initiative) => ({
      url: `${defaultUrl}/iniciativas/${initiative.id}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    }));
  }

  return [
    {
      url: defaultUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: defaultUrl + "/iniciativas",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: defaultUrl + "/votacoes",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    ...initiatives,
  ];
}
