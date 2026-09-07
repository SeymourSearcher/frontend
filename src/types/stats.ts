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
