import type {
  BuyOrderListResponse,
  BuyOrderCreate,
  BuyOrder,
  FillableOrder,
  SellOrder,
  SellOrderListResponse,
  SellOrderCreate,
  FetchOrdersParams,
  FetchMyOrdersParams,
  FetchFillableParams,
  FetchSellOrdersParams,
} from "@/types/marketplace";
import type {
  ActiveAuctionListResponse,
  EndedAuction,
  EndedAuctionListResponse,
  AuctionFilters,
  AuctionStats,
  RecentBid,
} from "@/types/auction";
import type {
  HexAuctionStats,
  HexInfo,
  HexOwnersPage,
  HexSalesPage,
  HexStatsTier,
} from "@/types/hex";
import type { VisualizationRequest, VisualizationStats } from "@/types/visualization";
import type {
  CollectionValue,
  Seymour,
  SeymourRemoval,
  SubFilterOption,
} from "@/types/seymour";
import type { Stats, RankingUser } from "@/types/stats";
import type { PieceIndex } from "@/lib/pieces";
import { env } from "@/lib/env";
import { type ApiResult, NETWORK_ERROR_STATUS } from "@/lib/apiResult";

function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

type QueryValue = string | number | boolean | readonly (string | number)[] | undefined | null;

/** Omits empty values, so absent filters stay absent rather than becoming `?tier=`. */
function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) search.set(key, value.join(","));
      continue;
    }
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** FastAPI sends `{detail: string}`; validation failures send `{detail: [...]}` instead. */
async function readDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    // Fall through to the generic message.
  }
  return `Request failed (${res.status})`;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  parseAs: "json" | "text" = "json"
): Promise<ApiResult<T>> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${env.apiUrl}${endpoint}`, { ...options, headers });
  } catch {
    return {
      ok: false,
      status: NETWORK_ERROR_STATUS,
      detail: "Could not reach the server. Check your connection and try again.",
    };
  }

  if (!res.ok) {
    return { ok: false, status: res.status, detail: await readDetail(res) };
  }

  const data = parseAs === "text" ? await res.text() : await res.json();
  return { ok: true, data: data as T };
}

function postJson<T>(endpoint: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

interface CurrentUser {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
}

export function exchangeCode(code: string) {
  return postJson<{ access_token: string }>("/auth/discord/callback", { code });
}

export function fetchCurrentUser(): Promise<ApiResult<CurrentUser>> {
  // Short-circuit rather than spend a guaranteed-401 round trip on every anonymous page load.
  if (!getToken()) {
    return Promise.resolve({ ok: false, status: 401, detail: "Not signed in" });
  }
  return request<CurrentUser>("/auth/me");
}

export function uploadSeymours(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  // No Content-Type header -- the browser must set it to include the multipart boundary.
  return request<{ imported: number; skipped: number }>("/seymours/upload", {
    method: "POST",
    body: formData,
  });
}

/** Clears the uploaded collection. The account itself survives — see RemovalResponse. */
export function deleteAllSeymours() {
  return request<SeymourRemoval>("/seymours/", { method: "DELETE" });
}

export function fetchGlobalStats() {
  return request<Stats>("/stats/");
}

export function fetchUserStats() {
  return request<Stats>("/stats/me");
}

/** Separate from fetchUserStats so the chips never wait on an auction aggregate. */
export function fetchCollectionValue(includeDyes = false) {
  return request<CollectionValue>(
    `/stats/me/valuation${toQuery({ include_dyes: includeDyes || undefined })}`
  );
}

/**
 * The /items dropdown options — only what the user owns, with counts.
 * Not /seymours/available-filters, which fetchAvailableSets still reads
 * unrestricted so the marketplace can order a set you do not own.
 */
export function fetchSubFilters(filter: string, incompleteOnly = false, includeDyes = false) {
  const query = toQuery({
    filter,
    incomplete_only: incompleteOnly || undefined,
    include_dyes: includeDyes || undefined,
  });
  return request<SubFilterOption[]>(`/seymours/sub-filters${query}`);
}

export function fetchUserSeymours(
  filter?: string,
  subFilter?: string,
  skip = 0,
  limit = 100,
  incompleteOnly = false,
  includeDyes = false,
  sort?: string
) {
  const query = toQuery({
    skip,
    limit,
    filter: filter && filter !== "all" ? filter : undefined,
    sub_filter: subFilter,
    incomplete_only: incompleteOnly || undefined,
    include_dyes: includeDyes || undefined,
    sort,
  });
  return request<Seymour[]>(`/seymours/${query}`);
}

export function fetchUserSeymourHexes() {
  return request<[string, PieceIndex][]>("/seymours/hex-codes/with-pieces");
}

export function fetchRankings(sortBy?: keyof Stats) {
  return request<RankingUser[]>(`/stats/rankings${toQuery({ sort_by: sortBy })}`);
}

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

export function fetchOrders(params: FetchOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    order_type: params.order_type,
    set_name: params.set_name,
    piece_types: params.piece_types,
    tier: params.tier,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<BuyOrderListResponse>(`/marketplace/orders${query}`);
}

export function fetchMyOrders(params: FetchMyOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    status: params.status,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<BuyOrderListResponse>(`/marketplace/orders/mine${query}`);
}

export function fetchFillableOrders(params: FetchFillableParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<FillableOrder[]>(`/marketplace/orders/fillable${query}`);
}

export function createOrder(data: BuyOrderCreate) {
  return postJson<BuyOrder>("/marketplace/orders", data);
}

export function cancelOrder(orderId: number) {
  return request<{ detail: string }>(`/marketplace/orders/${orderId}`, { method: "DELETE" });
}

export function fetchAvailableSets() {
  return request<string[]>("/seymours/available-filters?filter=sets");
}

export function fetchSetsPieces() {
  return request<Record<string, PieceIndex[]>>("/marketplace/sets-pieces");
}

export function fetchSellOrders(params: FetchSellOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    piece_type: params.piece_type,
    hex_color: params.hex_color,
    min_price: params.min_price,
    max_price: params.max_price,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<SellOrderListResponse>(`/marketplace/orders/sell${query}`);
}

export function fetchMySellOrders(params: FetchMyOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    status: params.status,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<SellOrderListResponse>(`/marketplace/orders/sell/mine${query}`);
}

export function createSellOrders(data: SellOrderCreate) {
  return postJson<SellOrder[]>("/marketplace/orders/sell", data);
}

export function cancelSellOrder(orderId: number) {
  return request<{ detail: string }>(`/marketplace/orders/sell/${orderId}`, { method: "DELETE" });
}

function auctionQuery(params: AuctionFilters): string {
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

export function fetchVisualizationStats(data: VisualizationRequest) {
  return postJson<VisualizationStats>("/visualization/stats", data);
}

export function fetchVisualizationHtml(data: VisualizationRequest) {
  return request<string>(
    "/visualization/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    "text"
  );
}
