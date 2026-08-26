import type { PieceIndex } from "@/lib/pieces";

export interface HexUser {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  delta_e: number;
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
}

export interface HexInfo {
  hex_code: string;
  top_matches: HexMatch[];
}
