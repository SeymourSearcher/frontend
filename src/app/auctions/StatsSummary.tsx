"use client";

import type { AuctionStats } from "@/types/auction";
import { formatPrice } from "@/lib/format";

interface StatsSummaryProps {
  stats: AuctionStats;
}

function StatCard({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a] flex flex-col">
      <span className="text-[10px] text-[#666] uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[20px] text-[#f0f0f0] font-medium mt-1">
        {value}
      </span>
      {subValue && (
        <span className="text-[10px] text-[#888] mt-0.5">{subValue}</span>
      )}
    </div>
  );
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  const binPercent =
    stats.total > 0 ? ((stats.bin_count / stats.total) * 100).toFixed(0) : "0";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Total Sales" value={stats.total.toLocaleString()} />
      <StatCard
        label="Avg Price"
        value={formatPrice(Math.round(stats.avg_price))}
      />
      <StatCard
        label="Median Price"
        value={formatPrice(Math.round(stats.median_price))}
      />
      <StatCard
        label="Total Volume"
        value={formatPrice(stats.total_volume)}
      />
      <StatCard
        label="BIN Rate"
        value={`${binPercent}%`}
        subValue={`${stats.bin_count} BIN / ${stats.auction_count} Auction`}
      />
      <StatCard
        label="By Tier"
        value={`${stats.t1_count} T1`}
        subValue={`${stats.t2_count} T2 / ${stats.t3_count} T3`}
      />
    </div>
  );
}
