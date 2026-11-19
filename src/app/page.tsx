import type { RankingUser, Stats } from "@/types/stats";
import type { EndedAuction } from "@/types/auction";
import { HomeContent } from "@/components/HomeContent";
import { TopCollectors } from "@/components/home/TopCollectors";
import { TopSalesTicker } from "@/components/home/TopSalesTicker";
import { getJson } from "@/lib/serverFetch";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;

const TOP_COLLECTORS = 3;
const REVALIDATE_S = 60;

export default async function Home() {
  const [stats, rankings, topSales] = await Promise.all([
    getJson<Stats>("/stats/", REVALIDATE_S),
    getJson<RankingUser[]>("/stats/rankings", REVALIDATE_S),
    getJson<EndedAuction[]>("/auctions/top-sales", REVALIDATE_S),
  ]);

  return (
    <main className="min-h-screen bg-[#121212] pt-[22px] pb-16">
      <HomeContent stats={stats} />
      <TopCollectors users={(rankings ?? []).slice(0, TOP_COLLECTORS)} />
      <TopSalesTicker sales={topSales ?? []} />
    </main>
  );
}
