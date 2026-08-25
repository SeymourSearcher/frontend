import { Stats } from "@/types/stats";
import { HomeContent } from "@/components/HomeContent";
import { API_URL } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;

async function getStats(): Promise<Stats | null> {
  try {
    const res = await fetch(`${API_URL}/stats/`, { next: { revalidate: 60 } });
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
