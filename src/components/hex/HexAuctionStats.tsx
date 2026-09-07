"use client";

import { useState } from "react";
import { fetchHexAuctionStats } from "@/lib/api";
import type { HexAuctionStats as Stats, HexStatsTier } from "@/types/hex";
import type { PieceIndex } from "@/lib/pieces";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import StatsSummary from "@/components/auctions/StatsSummary";
import PriceDistributionChart from "@/components/auctions/PriceDistributionChart";
import { TIER_CONFIG, TIER_KEYS, type TierKey } from "./tierConfig";

const CHIP =
  "text-[10px] px-2 py-1 rounded border cursor-pointer font-['MinecraftSeven',Arial,sans-serif] transition-colors";
const ON = "bg-[#5865F2] border-[#5865F2] text-white";
const OFF = "bg-[#1a1a1a] border-[#333] text-[#888] hover:border-[#555]";

interface HexAuctionStatsProps {
  hexcode: string;
  includeDyes: boolean;
  pieces: PieceIndex[];
}

function TierChips({
  selected,
  searchTier,
  onChange,
}: {
  selected: HexStatsTier | undefined;
  searchTier: string | null;
  onChange: (tier: HexStatsTier | undefined) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {TIER_KEYS.map((tier) => (
        <button
          key={tier}
          className={`${CHIP} ${selected === tier || (!selected && searchTier === tier) ? ON : OFF}`}
          // Clearing the override rather than pinning the value keeps the
          // default following the colour if the slot filter changes its tier.
          onClick={() => onChange(searchTier === tier ? undefined : tier)}
          title={tier === searchTier ? "This colour's own tier" : TIER_CONFIG[tier].label}
        >
          {tier.toUpperCase()}
          {tier === searchTier && <span className="ml-1 text-[8px]">●</span>}
        </button>
      ))}
      <button
        className={`${CHIP} ${selected === "all" ? ON : OFF}`}
        onClick={() => onChange("all")}
      >
        All
      </button>
    </div>
  );
}

function Caption({ stats }: { stats: Stats }) {
  if (!stats.target_hex) return null;

  const tier = stats.tier as TierKey | null;

  return (
    <span className="text-[#666] text-[11px]">
      {stats.target_name}
      <span className={`ml-1 ${tier ? TIER_CONFIG[tier].color : ""}`}>
        {tier ? TIER_CONFIG[tier].label : "all tiers"}
      </span>
    </span>
  );
}

/** Elaborates on the hero's estimate — same colour, and its tier by default. */
export function HexAuctionStats({ hexcode, includeDyes, pieces }: HexAuctionStatsProps) {
  const [tier, setTier] = useState<HexStatsTier | undefined>(undefined);
  const pieceKey = pieces.join(",");

  const { state } = useAsyncData<Stats>(
    () => fetchHexAuctionStats(hexcode, includeDyes, pieces, tier),
    [hexcode, includeDyes, pieceKey, tier]
  );

  const data = state.status === "success" ? state.data : null;

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-[#888] text-[12px]">Auction stats</h2>
        {data && <Caption stats={data} />}
      </div>

      <div className="mb-3">
        <TierChips
          selected={tier}
          searchTier={data?.search_tier ?? null}
          onChange={setTier}
        />
      </div>

      {state.status === "loading" ? (
        <div className="h-[220px] rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] animate-pulse" />
      ) : state.status === "error" ? (
        <StatusMessage tone="error">{state.detail}</StatusMessage>
      ) : state.data.total === 0 ? (
        <div className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-6">
          <StatusMessage>
            {state.data.tier || tier === "all"
              ? "No comparable sales for this colour yet"
              : "Too far from any catalog colour to price — pick a tier to browse"}
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
