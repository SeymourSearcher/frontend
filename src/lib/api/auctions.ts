import type {
  ActiveAuctionListResponse,
  EndedAuction,
  EndedAuctionListResponse,
  AuctionFilters,
  AuctionStats,
  RecentBid,
} from "@/types/auction";
import { request, toQuery } from "./client";

export function auctionQuery(params: AuctionFilters): string {
  return toQuery({
    skip: params.skip,
    limit: params.limit,
    hex_color: params.hex_color,
    pieces: params.pieces,
    min_price: params.min_price,
    max_price: params.max_price,
    bin_filter: params.bin_filter === "all" ? undefined : params.bin_filter,
    tier: params.tier,
    set_name: params.set_name,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    include_dyes: params.include_dyes,
  });
}

export function fetchActiveAuctions(params: AuctionFilters = {}) {
  return request<ActiveAuctionListResponse>(`/auctions/active${auctionQuery(params)}`);
}

export function fetchEndedAuctions(params: AuctionFilters = {}) {
  return request<EndedAuctionListResponse>(`/auctions/ended${auctionQuery(params)}`);
}

export function fetchRecentBids(limit = 50, includeDyes = true) {
  return request<RecentBid[]>(
    `/auctions/recent-bids${toQuery({ limit, include_dyes: includeDyes })}`
  );
}

export function fetchAuctionSets() {
  return request<string[]>("/auctions/sets");
}

export function fetchAuctionStats(params: AuctionFilters = {}) {
  return request<AuctionStats>(`/auctions/stats${auctionQuery(params)}`);
}

export function fetchTopSales(hours = 24, limit = 20) {
  return request<EndedAuction[]>(`/auctions/top-sales${toQuery({ hours, limit })}`);
}
