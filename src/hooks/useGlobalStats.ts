import { useState, useEffect } from "react";
import { fetchGlobalStats } from "@/lib/api";
import { GlobalStats } from "@/types/stats";

export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalStats()
      .then(setStats)
      .catch(() => { setStats(null); })
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

