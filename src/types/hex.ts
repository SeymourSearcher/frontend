import type { PieceIndex } from "@/lib/pieces";

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
