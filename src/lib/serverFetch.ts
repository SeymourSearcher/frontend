import { cache } from "react";
import { env } from "@/lib/env";
import type { PieceIndex } from "@/lib/pieces";
import type { ActiveAuctionListResponse, AuctionFilters, AuctionStats } from "@/types/auction";
import { auctionQuery } from "@/lib/api/auctions";
import type { HexAuctionStats, HexInfo, HexOwnersPage, HexSalesPage } from "@/types/hex";
import { SALES_PAGE_SIZE } from "@/lib/api/hex";

const TIMEOUT_MS = 5000;

// Server-only and read at runtime. Set it to the backend's address on the internal
// Docker network: that path skips Cloudflare, and the API exempts it from per-IP
// rate limits that would otherwise pool every crawler's page views into one bucket.
const API_BASE = process.env.INTERNAL_API_URL || env.apiUrl;

/**
 * Server-side GET through Next's data cache. Null on any failure, so a page can
 * omit a section or hand the fetch to the client rather than 500.
 */
export async function getJson<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// cache() because a fetch with a signal skips Next's per-render dedupe, and both
// generateMetadata and the page read these.
export const getHexInfo = cache((hexcode: string) => getJson<HexInfo>(`/hex/${hexcode}`, 300));

export const getHexOwners = cache((hexcode: string) =>
  getJson<HexOwnersPage>(`/hex/${hexcode}/owners?limit=1`, 300)
);

/** The hex page's default view: no dyes, all slots, the colour's own tier. */
export const getHexAuctionStats = (hexcode: string) =>
  getJson<HexAuctionStats>(`/hex/${hexcode}/auction-stats`, 300);

export const getHexSales = (hexcode: string) =>
  getJson<HexSalesPage>(`/hex/${hexcode}/sales?limit=${SALES_PAGE_SIZE}&offset=0`, 300);

const AUCTIONS_REVALIDATE_SECONDS = 15;

export const getActiveAuctions = (params: AuctionFilters) =>
  getJson<ActiveAuctionListResponse>(
    `/auctions/active${auctionQuery(params)}`,
    AUCTIONS_REVALIDATE_SECONDS
  );

export const getAuctionSets = () => getJson<string[]>("/auctions/sets", 300);

export const PIECE_REVALIDATE_SECONDS = 600;

export const getPieceStats = cache((piece: PieceIndex) =>
  getJson<AuctionStats>(`/auctions/stats?pieces=${piece}`, PIECE_REVALIDATE_SECONDS)
);
