import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { indexableRoutes } from "@/lib/routeConfig";
import { getJson } from "@/lib/serverFetch";

type CatalogTarget = { hex: string; name: string };

const CATALOG_REVALIDATE_SECONDS = 86_400;

// Not prerendered: the build can't reach the internal API, and a sitemap frozen
// without hex pages would stay that way. The catalog fetch itself is still cached.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const pages: MetadataRoute.Sitemap = indexableRoutes.map((route) => ({
    url: `${baseUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const targets =
    (await getJson<CatalogTarget[]>("/catalog/targets", CATALOG_REVALIDATE_SECONDS)) ?? [];
  const hexPages: MetadataRoute.Sitemap = targets.map(({ hex }) => ({
    url: `${baseUrl}/hex/${hex}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...pages, ...hexPages];
}
