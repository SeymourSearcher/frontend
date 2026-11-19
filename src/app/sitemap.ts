import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { indexableRoutes } from "@/lib/routeConfig";

// TODO: add /hex/{target_hex} for every catalog target colour once the backend exposes a list of them.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return indexableRoutes.map((route) => ({
    url: `${baseUrl}${route.path === "/" ? "" : route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
