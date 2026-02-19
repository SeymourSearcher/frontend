import { GlobalStats } from "@/types/stats";
import { HomeContent } from "@/components/HomeContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getGlobalStats(): Promise<GlobalStats | null> {
  try {
    const res = await fetch(`${API_URL}/stats/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const stats = await getGlobalStats();

  return (
    <main className="min-h-screen bg-[#121212] pt-[22px]">
      <HomeContent stats={stats} />
    </main>
  );
}
