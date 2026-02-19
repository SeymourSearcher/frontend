export enum OrderType {
  SET_PIECE = "set_piece",
  HEX_PATTERN = "hex_pattern",
}

export enum OrderStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export enum HexMatchType {
  EXACT = "exact",
  PATTERN = "pattern",
  DELTA_E = "delta_e",
}

export enum Tier {
  T1 = "t1",
  T2 = "t2",
  T3 = "t3",
}

export interface SetCriteria {
  set_name: string;
  piece_types: number[];
  tier: Tier;
}

export interface HexCriteria {
  match_type: HexMatchType;
  hex_value: string;
  max_delta_e: number | null;
  piece_type: number | null;
}

export interface OrderUser {
  discord_id: number;
  username: string;
  avatar_hash: string | null;
}

export interface BuyOrder {
  id: number;
  user_id: number;
  price: number;
  order_type: OrderType;
  status: OrderStatus;
  created_at: string;
  expires_at: string;
  set_criteria: SetCriteria | null;
  hex_criteria: HexCriteria | null;
  user: OrderUser | null;
}

export interface BuyOrderListResponse {
  orders: BuyOrder[];
  total: number;
}

export interface MatchingSeymour {
  id: number;
  item_name: number;
  hex_color: string;
}

export interface FillableOrder {
  order: BuyOrder;
  matching_seymours: MatchingSeymour[];
}

export type SortBy = "price" | "expires_at" | "delta_e";
export type SortOrder = "asc" | "desc";

export interface SetCriteriaCreate {
  set_name: string;
  piece_types: number[];
  tier: Tier;
}

export interface HexCriteriaCreate {
  match_type: HexMatchType;
  hex_value: string;
  max_delta_e?: number | null;
  piece_type?: number | null;
}

export interface BuyOrderCreate {
  price: number;
  order_type: OrderType;
  set_criteria?: SetCriteriaCreate | null;
  hex_criteria?: HexCriteriaCreate | null;
}

export interface SellOrderMatch {
  target_name: string;
  target_hex: string;
  delta_e: number;
}

export interface SellOrderSeymour {
  id: number;
  item_name: number;
  hex_color: string;
  match: SellOrderMatch | null;
}

export interface SellOrder {
  id: number;
  price: number;
  status: OrderStatus;
  created_at: string;
  expires_at: string;
  seymour: SellOrderSeymour;
  user: OrderUser | null;
}

export interface SellOrderListResponse {
  orders: SellOrder[];
  total: number;
}

export interface SellOrderCreate {
  seymour_ids: number[];
  price: number;
  expires_hours?: number;
}

export interface SellOrderFilters {
  piece_type?: number;
  hex_color?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: SortBy;
  sort_order?: SortOrder;
}
