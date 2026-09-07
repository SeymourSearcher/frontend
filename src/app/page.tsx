import type { FeaturedSet, RankingUser, Stats } from "@/types/stats";
import { HomeContent } from "@/components/HomeContent";
import { FeaturedSets } from "@/components/home/FeaturedSets";
import { TopCollectors } from "@/components/home/TopCollectors";
import { env } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;

const TOP_COLLECTORS = 3;

/** Null on any failure: a section the API could not serve is omitted, not fatal. */
async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${env.apiUrl}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const [stats, rankings, featuredSets] = await Promise.all([
    getJson<Stats>("/stats/"),
    getJson<RankingUser[]>("/stats/rankings"),
    getJson<FeaturedSet[]>("/stats/custom-sets"),
  ]);

  return (
    <main className="min-h-screen bg-[#121212] pt-[22px] pb-16">
      <HomeContent stats={stats} />
      <FeaturedSets sets={featuredSets ?? []} />
      <TopCollectors users={(rankings ?? []).slice(0, TOP_COLLECTORS)} />
    </main>
  );
}
