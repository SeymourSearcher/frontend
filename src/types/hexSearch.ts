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
  /** Always false when logged out — the API knows of no "me" to compare against. */
  owned_by_me: boolean;
}

export interface HexSearchPage {
  pattern: string;
  /** What the pattern denotes across the whole colour space. Up to 16,777,216. */
  pattern_total: number;
  /** How many of those anyone holds, after the filters; what `offset` pages over. */
  total: number;
  /** What was actually applied — false for a logged-out caller that asked for it. */
  mine_only: boolean;
  limit: number;
  offset: number;
  items: HexSearchResult[];
}

export interface HexSearchParams {
  includeDyes?: boolean;
  mineOnly?: boolean;
  tier?: HexStatsTier;
  pieces?: PieceIndex[];
  limit?: number;
  offset?: number;
}
