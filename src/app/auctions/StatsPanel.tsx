"use client";

import type { AuctionStats } from "@/types/auction";
import PriceDistributionChart from "@/components/auctions/PriceDistributionChart";
import PeakTimesChart from "./PeakTimesChart";
import StatsSummary from "@/components/auctions/StatsSummary";

interface StatsPanelProps {
  stats: AuctionStats | null;
  loading: boolean;
}

export default function StatsPanel({ stats, loading }: StatsPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#888] text-[14px]">Loading stats...</div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#888] text-[14px]">No auction data available for these filters</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StatsSummary stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceDistributionChart buckets={stats.price_distribution} />
        <PeakTimesChart hourlyData={stats.hourly_activity} />
      </div>
    </div>
  );
}
