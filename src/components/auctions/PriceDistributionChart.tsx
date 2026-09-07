"use client";

import type { PriceBucket } from "@/types/auction";

interface PriceDistributionChartProps {
  buckets: PriceBucket[];
}

export default function PriceDistributionChart({ buckets }: PriceDistributionChartProps) {
  if (!buckets || buckets.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        <h3 className="text-[13px] text-[#ccc] mb-4">Price Distribution</h3>
        <div className="flex items-center justify-center h-[140px] text-[#666] text-[12px]">
          No price data available
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
      <h3 className="text-[13px] text-[#ccc] mb-4">Price Distribution</h3>
      <div className="flex flex-col gap-2">
        {buckets.map((bucket, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-[10px] text-[#888] w-[100px] text-right shrink-0">
              {bucket.label}
            </span>
            <div className="flex-1 h-5 bg-[#252525] rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded transition-all duration-300"
                style={{ width: `${(bucket.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[#666] w-[40px]">
              {bucket.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
