import { Stats } from "@/types/stats";
import { HomeContent } from "@/components/HomeContent";
import { env } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;

async function getStats(): Promise<Stats | null> {
  try {
    const res = await fetch(`${env.apiUrl}/stats/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-[#121212] pt-[22px]">
      <HomeContent stats={stats} />
    </main>
  );
}
