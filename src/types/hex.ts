import type { PieceIndex } from "@/lib/pieces";
import type { AuctionStats } from "@/types/auction";

/** A user's best holding near one catalog colour. */
export interface HexUser {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  delta_e: number;
}

/** median is null when nothing comparable has sold — not a price of zero. */
export interface HexPrice {
  median: number | null;
  sales: number;
}

export interface HexMatch {
  target_name: string;
  target_hex: string;
  delta_e: number;
  pieces: PieceIndex[];
  users_by_tier: {
    t1: HexUser[];
    t2: HexUser[];
    t3: HexUser[];
  };
  price: HexPrice;
}

export interface HexInfo {
  hex_code: string;
  /** Set when the searched colour is itself a catalog colour; absent from top_matches. */
  exact_match: HexMatch | null;
  top_matches: HexMatch[];
}

/** One user's holding near the searched hex; identical holdings are collapsed. */
export interface HexOwnerMatch {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  piece: PieceIndex;
  hex_color: string;
  delta_e: number;
  quantity: number;
}

export interface HexOwnersPage {
  total: number;
  max_delta_e: number;
  items: HexOwnerMatch[];
}

/** "all" prices every band; otherwise the searched colour's own band is the default. */
export type HexStatsTier = "t1" | "t2" | "t3" | "all";

export interface HexAuctionStats extends AuctionStats {
  target_name: string | null;
  target_hex: string | null;
  /** The band the searched colour earns — null past ΔE 10. */
  search_tier: string | null;
  /** The band actually priced — null when every tier was asked for. */
  tier: string | null;
}
