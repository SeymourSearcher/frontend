import type { RankingUser } from "@/types/stats";
import { getJson } from "@/lib/serverFetch";
import { RankingBoard } from "./RankingBoard";

export default async function RankingPage() {
  // The API's default sort, so this shares the home page's cached response.
  const initialRankings = await getJson<RankingUser[]>("/stats/rankings", 60);
  return <RankingBoard initialRankings={initialRankings} />;
}
