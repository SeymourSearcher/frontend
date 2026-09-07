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

/** What clearing a collection took with it. The sell orders go by FK cascade. */
export type SeymourRemoval = {
  removed: number;
  sell_orders_cancelled: number;
};

export type FilterType ="all" | "stars" | "t1" | "t2" | "t3" | "words" | "dupes" | "sets" | "dyes" | "custom";

