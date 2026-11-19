import type {
  HexAuctionStats,
  HexInfo,
  HexOwnersPage,
  HexSalesPage,
  HexStatsTier,
} from "@/types/hex";
import type {
  HexSearchPage,
  HexSearchParams,
  PatternAuctionStats,
  PatternSalesPage,
} from "@/types/hexSearch";
import type { PieceIndex } from "@/lib/pieces";
import { request, toQuery } from "./client";

export function fetchHexInfo(hexCode: string, includeDyes = false, pieces?: PieceIndex[]) {
  const query = toQuery({
    include_dyes: includeDyes || undefined,
    pieces: pieces?.length ? pieces.join(",") : undefined,
  });
  return request<HexInfo>(`/hex/${hexCode}${query}`);
}

export function fetchHexAuctionStats(
  hexCode: string,
  includeDyes = false,
  pieces?: PieceIndex[],
  tier?: HexStatsTier
) {
  const query = toQuery({
    include_dyes: includeDyes || undefined,
    pieces: pieces?.length ? pieces.join(",") : undefined,
    tier,
  });
  return request<HexAuctionStats>(`/hex/${hexCode}/auction-stats${query}`);
}

export function fetchHexOwners(
  hexCode: string,
  limit: number,
  offset: number,
  pieces?: PieceIndex[]
) {
  const query = toQuery({
    limit,
    offset,
    pieces: pieces?.length ? pieces.join(",") : undefined,
  });
  return request<HexOwnersPage>(`/hex/${hexCode}/owners${query}`);
}

export function fetchHexSales(
  hexCode: string,
  includeDyes = false,
  pieces?: PieceIndex[],
  tier?: HexStatsTier,
  limit = 8,
  offset = 0
) {
  const query = toQuery({
    include_dyes: includeDyes || undefined,
    pieces: pieces?.length ? pieces.join(",") : undefined,
    tier,
    limit,
    offset,
  });
  return request<HexSalesPage>(`/hex/${hexCode}/sales${query}`);
}

export function fetchHexSearch(pattern: string, params: HexSearchParams = {}) {
  const query = toQuery({
    p: pattern,
    include_dyes: params.includeDyes || undefined,
    mine_only: params.mineOnly || undefined,
    tier: params.tier,
    pieces: params.pieces?.length ? params.pieces.join(",") : undefined,
    limit: params.limit,
    offset: params.offset || undefined,
  });
  return request<HexSearchPage>(`/hex-search${query}`);
}

/** "all" is the page's every-band sentinel; the API spells that as no tier at all. */
function patternQuery(
  pattern: string,
  includeDyes: boolean,
  pieces?: PieceIndex[],
  tier?: HexStatsTier,
  extra: Record<string, number> = {}
) {
  return toQuery({
    p: pattern,
    include_dyes: includeDyes || undefined,
    pieces: pieces?.length ? pieces.join(",") : undefined,
    tier: tier === "all" ? undefined : tier,
    ...extra,
  });
}

export function fetchPatternAuctionStats(
  pattern: string,
  includeDyes = false,
  pieces?: PieceIndex[],
  tier?: HexStatsTier
) {
  const query = patternQuery(pattern, includeDyes, pieces, tier);
  return request<PatternAuctionStats>(`/hex-search/auction-stats${query}`);
}

export function fetchPatternSales(
  pattern: string,
  includeDyes = false,
  pieces?: PieceIndex[],
  tier?: HexStatsTier,
  limit = 8,
  offset = 0
) {
  const query = patternQuery(pattern, includeDyes, pieces, tier, { limit, offset });
  return request<PatternSalesPage>(`/hex-search/sales${query}`);
}
