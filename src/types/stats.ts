/** Shape returned by /stats/, /stats/me and (with the user fields) /stats/rankings. */
export interface Stats {
  stars: number;
  t1: number;
  t2: number;
  t3: number;
  words: number;
  dupes: number;
  total_sets: number;
  dyed_sets: number;
  total_seymours: number;
}

export interface RankingUser extends Stats {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
}

/** Shape returned by /stats/custom-sets. `hexes` is helmet, chestplate, leggings, boots. */
export interface FeaturedSet {
  discord_id: string;
  username: string;
  avatar_hash: string | null;
  avg_delta_e: number;
  hexes: string[];
}
