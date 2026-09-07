"use client";

import { fetchHexAuctionStats } from "@/lib/api";
import type { HexAuctionStats } from "@/types/hex";
import type { PieceIndex } from "@/lib/pieces";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import StatsSummary from "@/components/auctions/StatsSummary";
import PriceDistributionChart from "@/components/auctions/PriceDistributionChart";
import { TIER_CONFIG, type TierKey } from "./tierConfig";

interface HexAuctionStatsProps {
  hexcode: string;
  includeDyes: boolean;
  pieces: PieceIndex[];
}

function Caption({ stats }: { stats: HexAuctionStats }) {
  if (!stats.target_hex) return null;

  const tier = stats.tier as TierKey | null;

  return (
    <span className="text-[#666] text-[11px]">
      {stats.target_name}
      {tier && <span className={`ml-1 ${TIER_CONFIG[tier].color}`}>{TIER_CONFIG[tier].label}</span>}
    </span>
  );
}

/** Elaborates on the hero's estimate — same colour, same tier, more detail. */
export function HexAuctionStats({ hexcode, includeDyes, pieces }: HexAuctionStatsProps) {
  const pieceKey = pieces.join(",");

  const { state } = useAsyncData<HexAuctionStats>(
    () => fetchHexAuctionStats(hexcode, includeDyes, pieces),
    [hexcode, includeDyes, pieceKey]
  );

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[#888] text-[12px]">Auction stats</h2>
        {state.status === "success" && <Caption stats={state.data} />}
      </div>

      {state.status === "loading" ? (
        <div className="h-[220px] rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] animate-pulse" />
      ) : state.status === "error" ? (
        <StatusMessage tone="error">{state.detail}</StatusMessage>
      ) : state.data.total === 0 ? (
        <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-6">
          <StatusMessage>
            {state.data.tier
              ? "No comparable sales for this colour yet"
              : "Too far from any catalog colour to price"}
          </StatusMessage>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <StatsSummary stats={state.data} />
          <PriceDistributionChart buckets={state.data.price_distribution} />
        </div>
      )}
    </section>
  );
}
