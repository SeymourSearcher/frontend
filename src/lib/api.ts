import type {
  BuyOrderListResponse,
  BuyOrderCreate,
  BuyOrder,
  OrderType,
  OrderStatus,
  FillableOrder,
  SortBy,
  SortOrder,
  SellOrder,
  SellOrderListResponse,
  SellOrderCreate,
  SellOrderFilters,
} from "@/types/marketplace";
import type {
  ActiveAuctionListResponse,
  EndedAuctionListResponse,
  AuctionFilters,
  AuctionStats,
} from "@/types/auction";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const token = getToken();
  const headers: HeadersInit = { ...options?.headers };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) return null;
  return res.json();
}

export async function exchangeCode(code: string) {
  const res = await fetch(`${API_URL}/auth/discord/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) return null;
  return res.json() as Promise<{ access_token: string }>;
}

export async function fetchCurrentUser() {
  if (!getToken()) return null;
  return request<{ discord_id: string; username: string; avatar_hash: string | null }>("/auth/me");
}

export async function uploadSeymours(file: File) {
  const token = getToken();
  if (!token) return null;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/seymours/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) return null;
  return res.json() as Promise<{ imported: number; skipped: number }>;
}

export async function fetchGlobalStats() {
  const res = await fetch(`${API_URL}/stats/`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchUserStats() {
  return request<{
    stars: number;
    t1: number;
    t2: number;
    t3: number;
    words: number;
    dupes: number;
    total_sets: number;
    dyed_sets: number;
    custom_sets: number;
    total_seymours: number;
  }>("/stats/me");
}

export async function fetchUserSeymours(filter?: string, subFilter?: string, skip = 0, limit = 100, incompleteOnly = false, includeDyes = false, sort?: string) {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (filter && filter !== "all") {
    params.set("filter", filter);
  }
  if (subFilter) {
    params.set("sub_filter", subFilter);
  }
  if (incompleteOnly) {
    params.set("incomplete_only", "true");
  }
  if (includeDyes) {
    params.set("include_dyes", "true");
  }
  if (sort) {
    params.set("sort", sort);
  }
  return request<{
    id: number;
    item_name: string;
    hex_color: string;
    match?: { target_name: string; target_hex: string; delta_e: number; missing?: string[] } | null;
  }[]>(`/seymours/?${params}`);
}

export async function fetchAvailableFilters(filter: string, incompleteOnly = false, includeDyes = false) {
  const params = new URLSearchParams({ filter });
  if (incompleteOnly) {
    params.set("incomplete_only", "true");
  }
  if (includeDyes) {
    params.set("include_dyes", "true");
  }
  return request<string[]>(`/seymours/available-filters?${params}`);
}

export interface RankingUser {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  stars: number;
  t1: number;
  t2: number;
  t3: number;
  words: number;
  dupes: number;
  total_sets: number;
  dyed_sets: number;
  custom_sets: number;
  total_seymours: number;
}

export async function fetchRankings() {
  const res = await fetch(`${API_URL}/stats/rankings`);
  if (!res.ok) return null;
  return res.json() as Promise<RankingUser[]>;
}

export interface HexUser {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  delta_e: number;
}

export interface HexMatch {
  item_name: string;
  target_hex: string;
  delta_e: number;
  pieces: string[];
  users_by_tier: {
    t1: HexUser[];
    t2: HexUser[];
    t3: HexUser[];
  };
}

export interface HexInfo {
  hex_code: string;
  top_matches: HexMatch[];
}

export async function fetchHexInfo(hexCode: string, includeDyes: boolean = false): Promise<HexInfo | null> {
  const params = includeDyes ? '?include_dyes=true' : '';
  const res = await fetch(`${API_URL}/hex/${hexCode}${params}`);
  if (!res.ok) return null;
  return res.json();
}

export interface FetchOrdersParams {
  skip?: number;
  limit?: number;
  order_type?: OrderType;
  set_name?: string;
  piece_types?: number[];
  tier?: string;
  sort_by?: SortBy;
  sort_order?: SortOrder;
}

export interface FetchMyOrdersParams {
  skip?: number;
  limit?: number;
  status?: OrderStatus;
  sort_by?: SortBy;
  sort_order?: SortOrder;
}

export interface FetchFillableParams {
  skip?: number;
  limit?: number;
  sort_by?: SortBy;
  sort_order?: SortOrder;
}

export async function fetchOrders(params: FetchOrdersParams = {}): Promise<BuyOrderListResponse | null> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.order_type) searchParams.set("order_type", params.order_type);
  if (params.set_name) searchParams.set("set_name", params.set_name);
  if (params.piece_types && params.piece_types.length > 0) {
    searchParams.set("piece_types", params.piece_types.join(","));
  }
  if (params.tier) searchParams.set("tier", params.tier);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/marketplace/orders${query ? `?${query}` : ""}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchMyOrders(params: FetchMyOrdersParams = {}): Promise<BuyOrderListResponse | null> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const query = searchParams.toString();
  return request<BuyOrderListResponse>(`/marketplace/orders/mine${query ? `?${query}` : ""}`);
}

export async function fetchFillableOrders(params: FetchFillableParams = {}): Promise<FillableOrder[] | null> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const query = searchParams.toString();
  return request<FillableOrder[]>(`/marketplace/orders/fillable${query ? `?${query}` : ""}`);
}

export class ApiError extends Error {
  constructor(public detail: string) {
    super(detail);
  }
}

export async function createOrder(data: BuyOrderCreate): Promise<BuyOrder> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/marketplace/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to create order" }));
    throw new ApiError(errorData.detail || "Failed to create order");
  }
  return res.json();
}

export async function cancelOrder(orderId: number): Promise<{ detail: string } | null> {
  return request<{ detail: string }>(`/marketplace/orders/${orderId}`, {
    method: "DELETE",
  });
}

export async function fetchAvailableSets(): Promise<string[] | null> {
  const res = await fetch(`${API_URL}/seymours/available-filters?filter=sets`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchSetsPieces(): Promise<Record<string, number[]> | null> {
  const res = await fetch(`${API_URL}/marketplace/sets-pieces`);
  if (!res.ok) return null;
  return res.json();
}

export interface FetchSellOrdersParams extends SellOrderFilters {
  skip?: number;
  limit?: number;
}

export async function fetchSellOrders(params: FetchSellOrdersParams = {}): Promise<SellOrderListResponse | null> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.piece_type !== undefined) searchParams.set("piece_type", String(params.piece_type));
  if (params.hex_color) searchParams.set("hex_color", params.hex_color);
  if (params.min_price !== undefined) searchParams.set("min_price", String(params.min_price));
  if (params.max_price !== undefined) searchParams.set("max_price", String(params.max_price));
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/marketplace/orders/sell${query ? `?${query}` : ""}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchMySellOrders(params: FetchMyOrdersParams = {}): Promise<SellOrderListResponse | null> {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);

  const query = searchParams.toString();
  return request<SellOrderListResponse>(`/marketplace/orders/sell/mine${query ? `?${query}` : ""}`);
}

export async function createSellOrders(data: SellOrderCreate): Promise<SellOrder[]> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/marketplace/orders/sell`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to create sell orders" }));
    throw new ApiError(errorData.detail || "Failed to create sell orders");
  }
  return res.json();
}

export async function cancelSellOrder(orderId: number): Promise<{ detail: string } | null> {
  return request<{ detail: string }>(`/marketplace/orders/sell/${orderId}`, {
    method: "DELETE",
  });
}

function buildAuctionParams(params: AuctionFilters): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.skip !== undefined) searchParams.set("skip", String(params.skip));
  if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params.hex_color) searchParams.set("hex_color", params.hex_color);
  if (params.pieces?.length) searchParams.set("pieces", params.pieces.join(","));
  if (params.min_price !== undefined) searchParams.set("min_price", String(params.min_price));
  if (params.max_price !== undefined) searchParams.set("max_price", String(params.max_price));
  if (params.bin_filter && params.bin_filter !== "all") searchParams.set("bin_filter", params.bin_filter);
  if (params.tier) searchParams.set("tier", params.tier);
  if (params.set_name) searchParams.set("set_name", params.set_name);
  if (params.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params.sort_order) searchParams.set("sort_order", params.sort_order);
  if (params.include_dyes !== undefined) searchParams.set("include_dyes", String(params.include_dyes));
  return searchParams;
}

export async function fetchActiveAuctions(
  params: AuctionFilters = {}
): Promise<ActiveAuctionListResponse | null> {
  const query = buildAuctionParams(params).toString();
  const res = await fetch(`${API_URL}/auctions/active${query ? `?${query}` : ""}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchEndedAuctions(
  params: AuctionFilters = {}
): Promise<EndedAuctionListResponse | null> {
  const query = buildAuctionParams(params).toString();
  const res = await fetch(`${API_URL}/auctions/ended${query ? `?${query}` : ""}`);
  if (!res.ok) return null;
  return res.json();
}

export interface RecentBid {
  auction_id: string;
  bidder_uuid: string;
  bidder_name: string | null;
  amount: number;
  timestamp: number;
  hex_color: string;
  piece: number;
  target_hex: string;
  set_name: string | null;
  delta_e: number;
  abs_diff: number;
}

export async function fetchRecentBids(limit = 50, includeDyes = true): Promise<RecentBid[] | null> {
  const res = await fetch(`${API_URL}/auctions/recent-bids?limit=${limit}&include_dyes=${includeDyes}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAuctionSets(): Promise<string[] | null> {
  const res = await fetch(`${API_URL}/auctions/sets`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAuctionStats(
  params: AuctionFilters = {}
): Promise<AuctionStats | null> {
  const query = buildAuctionParams(params).toString();
  const res = await fetch(`${API_URL}/auctions/stats${query ? `?${query}` : ""}`);
  if (!res.ok) return null;
  return res.json();
}
