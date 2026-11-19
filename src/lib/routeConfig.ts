import type { MetadataRoute } from "next";
import { PIECE_INDEXES, piecePath } from "@/lib/pieces";

export const indexableRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/marketplace", changeFrequency: "hourly", priority: 0.9 },
  { path: "/ranking", changeFrequency: "daily", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  ...PIECE_INDEXES.map((piece) => ({
    path: piecePath(piece),
    changeFrequency: "daily" as const,
    priority: 0.8,
  })),
];

// /search is unbounded (~2.8e9 patterns) and nothing caches it, so a crawler
// walking it is the HEX_LIMIT problem without the per-IP limiter to hold it.
export const disallowPaths = ["/auth/", "/api/", "/items", "/search"];
