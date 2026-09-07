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

/** One /items dropdown option. `name` is the sub_filter key, not a label. */
export type SubFilterOption = {
  name: string;
  count: number;
};

/** Estimated worth per filter chip, in coins. */
export type CategoryValues = {
  stars: number;
  words: number;
  dupes: number;
  t1: number;
  t2: number;
  t3: number;
  sets: number;
  dyes: number;
};

/**
 * Estimated worth of a collection.
 *
 * `categories` overlap — an item can be a Star and T1 and in a set — so they do
 * not sum to `total`. `unpriced` is how many items had no comparable sales and
 * were left out entirely.
 */
export type CollectionValue = {
  total: number;
  priced: number;
  unpriced: number;
  categories: CategoryValues;
};

/** What clearing a collection took with it. The sell orders go by FK cascade. */
export type SeymourRemoval = {
  removed: number;
  sell_orders_cancelled: number;
};

export type FilterType ="all" | "stars" | "t1" | "t2" | "t3" | "words" | "dupes" | "sets" | "dyes" | "custom";

