export interface ActiveAuction {
  auction_id: string;
  seller_uuid: string;
  seller_name: string | null;
  price: number;
  is_bin: boolean;
  start_time: number;
  end_time: number | null;
  item_uuid: string;
  hex_color: string;
  piece: number;
  tier: string | null;
  delta_e: number;
  abs_diff: number;
  target_hex: string;
  set_name: string | null;
}

export interface EndedAuction {
  auction_id: string;
  seller_uuid: string;
  seller_name: string | null;
  buyer_uuid: string;
  buyer_name: string | null;
  price: number;
  is_bin: boolean;
  item_uuid: string;
  hex_color: string;
  piece: number;
  timestamp: number;
  tier: string | null;
  delta_e: number;
  abs_diff: number;
  target_hex: string;
  set_name: string | null;
}

export interface ActiveAuctionListResponse {
  auctions: ActiveAuction[];
  total: number;
}

export interface EndedAuctionListResponse {
  auctions: EndedAuction[];
  total: number;
}

export interface AuctionFilters {
  hex_color?: string;
  pieces?: number[];
  min_price?: number;
  max_price?: number;
  bin_filter?: "all" | "bin" | "nobin";
  tier?: "t1" | "t2" | "t3";
  set_name?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  skip?: number;
  limit?: number;
  include_dyes?: boolean;
}

export interface PriceBucket {
  label: string;
  count: number;
  min_price: number;
  max_price: number;
}

export interface AuctionStats {
  total: number;
  avg_price: number;
  median_price: number;
  total_volume: number;
  bin_count: number;
  auction_count: number;
  t1_count: number;
  t2_count: number;
  t3_count: number;
  price_distribution: PriceBucket[];
  hourly_activity: number[];
}