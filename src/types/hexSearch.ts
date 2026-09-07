import type { PieceIndex } from "@/lib/pieces";
import type { HexStatsTier } from "@/types/hex";

export interface HexSearchOwner {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  pieces: PieceIndex[];
  quantity: number;
}

export interface HexSearchResult {
  hex_code: string;
  target_name: string | null;
  target_hex: string;
  delta_e: number;
  tier: string | null;
  owners: HexSearchOwner[];
  owner_count: number;
}

export interface HexSearchPage {
  pattern: string;
  /** What the pattern denotes, before any filter. Up to 16,777,216. */
  pattern_total: number;
  /** What survived the tier and ownership filters; what `offset` pages over. */
  total: number;
  limit: number;
  offset: number;
  items: HexSearchResult[];
}

export interface HexSearchParams {
  includeDyes?: boolean;
  ownedOnly?: boolean;
  tier?: HexStatsTier;
  pieces?: PieceIndex[];
  limit?: number;
  offset?: number;
}
