import type { PieceIndex } from "@/lib/pieces";

export interface HexMatch {
  target_name: string;
  target_hex: string;
  delta_e: number;
  pieces: PieceIndex[];
  owner_count: number;
}

export interface HexInfo {
  hex_code: string;
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
