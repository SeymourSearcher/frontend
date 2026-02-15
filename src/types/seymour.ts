export type MatchInfo = {
  target_name: string;
  target_hex: string;
  delta_e: number;
  missing?: string[];
};

export type Seymour = {
  id: number;
  item_name: string;
  hex_color: string;
  match?: MatchInfo | null;
};

export type UserStats = {
  stars: number;
  t1: number;
  t2: number;
  t3: number;
  words: number;
  dupes: number;
  total_sets: number;
  dyed_sets: number;
  total_seymours: number;
};

export type FilterType = "all" | "stars" | "t1" | "t2" | "t3" | "words" | "dupes" | "sets" | "dyes";

