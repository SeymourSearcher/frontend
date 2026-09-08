"use client";

import { fetchPatternAuctionStats } from "@/lib/api";
import type { PatternAuctionStats as Stats } from "@/types/hexSearch";
import type { HexStatsTier } from "@/types/hex";
import type { PieceIndex } from "@/lib/pieces";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import StatsSummary from "@/components/auctions/StatsSummary";
import PriceDistributionChart from "@/components/auctions/PriceDistributionChart";
import { TIER_CONFIG, type TierKey } from "@/components/hex/tierConfig";
import { PatternSales } from "./PatternSales";

interface PatternAuctionStatsProps {
  pattern: string;
  includeDyes: boolean;
  tier: HexStatsTier;
  pieces: PieceIndex[];
}

function Caption({ stats }: { stats: Stats }) {
  const tier = stats.tier as TierKey | null;

  return (
    <span className="text-[#666] text-[11px]">
      {stats.pattern}
      <span className={`ml-1 ${tier ? TIER_CONFIG[tier].color : ""}`}>
        {tier ? TIER_CONFIG[tier].label : "all tiers"}
      </span>
    </span>
  );
}

/**
 * The market behind the grid above: every ended auction whose own colour the
 * pattern matches, under the same filters. It carries no controls of its own —
 * PatternFilters drives both, so the figures always describe what is on screen.
 */
export function PatternAuctionStats({
  pattern,
  includeDyes,
  tier,
  pieces,
}: PatternAuctionStatsProps) {
  const pieceKey = pieces.join(",");

  const { state } = useAsyncData<Stats>(
    () => fetchPatternAuctionStats(pattern, includeDyes, pieces, tier),
    [pattern, includeDyes, pieceKey, tier]
  );

  const data = state.status === "success" ? state.data : null;

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-[#888] text-[12px]">Auction stats</h2>
        {data && <Caption stats={data} />}
      </div>

      {state.status === "loading" ? (
        <div className="h-[220px] rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] animate-pulse" />
      ) : state.status === "error" ? (
        <StatusMessage tone="error">{state.detail}</StatusMessage>
      ) : state.data.total === 0 ? (
        <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-6">
          <StatusMessage>
            {/* A pattern with no free slots is one exact colour, which almost
                never has sales of its own -- worth saying rather than looking broken. */}
            {state.data.pattern_total === 1
              ? "Nothing has sold in this exact colour"
              : "No auctions have ended for a colour matching this pattern"}
          </StatusMessage>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <StatsSummary stats={state.data} />
          <PriceDistributionChart buckets={state.data.price_distribution} />
          <PatternSales
            pattern={pattern}
            includeDyes={includeDyes}
            tier={tier}
            pieces={pieces}
          />
        </div>
      )}
    </section>
  );
}
