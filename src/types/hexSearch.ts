import type { PieceIndex } from "@/lib/pieces";
import type { AuctionStats, EndedAuction } from "@/types/auction";
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

/** Which pattern and band the auction figures were taken under. */
export interface PatternReference {
  /** Normalised — upper-cased and "#"-stripped — so it may differ from what was sent. */
  pattern: string;
  pattern_total: number;
  /** The band actually applied — null when every band was asked for. */
  tier: string | null;
}

/** Sales of the colours the pattern matches, not of the catalog colours they're near. */
export interface PatternAuctionStats extends AuctionStats, PatternReference {}

/** The sales PatternAuctionStats aggregates, newest first. */
export interface PatternSalesPage extends PatternReference {
  total: number;
  items: EndedAuction[];
}

export interface HexSearchParams {
  includeDyes?: boolean;
  mineOnly?: boolean;
  tier?: HexStatsTier;
  pieces?: PieceIndex[];
  limit?: number;
  offset?: number;
}
