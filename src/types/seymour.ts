import { PieceIndex } from "@/lib/pieces";

export type MatchInfo = {
  target_name: string;
  target_hex: string;
  delta_e: number;
  missing?: PieceIndex[];
};

export type Seymour = {
  id: number;
  item_name: PieceIndex;
  hex_color: string;
  match?: MatchInfo | null;
};

export type FilterType = "all" | "stars" | "t1" | "t2" | "t3" | "words" | "dupes" | "sets" | "dyes" | "custom";

