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
}
