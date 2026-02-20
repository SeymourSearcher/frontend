import type { MetadataRoute } from "next";

export const indexableRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/marketplace", changeFrequency: "hourly", priority: 0.9 },
  { path: "/ranking", changeFrequency: "daily", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
];

export const disallowPaths = ["/auth/", "/api/", "/items"];
