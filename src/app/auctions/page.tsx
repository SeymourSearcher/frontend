"use client";

import { useState, useMemo } from "react";
import { fetchActiveAuctions, fetchEndedAuctions, fetchRecentBids, fetchAuctionSets, fetchAuctionStats } from "@/lib/api";
import { mapResult, type ApiResult } from "@/lib/apiResult";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { RecentBid } from "@/types/auction";
import type { ActiveAuction, EndedAuction, AuctionFilters as AuctionFiltersParams, AuctionStats } from "@/types/auction";
import AuctionsGrid from "./AuctionsGrid";
import AuctionFilters from "./AuctionFilters";
import RecentBidsFeed from "./RecentBidsFeed";
import StatsPanel from "./StatsPanel";
import { TabButton } from "@/components/ui/TabButton";
import { Divider } from "@/components/ui/Divider";
import { PieceIndex } from "@/lib/pieces";

type Tab = "active" | "ended" | "recent-bids" | "stats";
type BinFilter = "all" | "bin" | "nobin";
type Tier = "t1" | "t2" | "t3" | "";

/** Tagged by tab so a slow response can never be rendered under the wrong one. */
type TabData =
  | { tab: "active"; auctions: ActiveAuction[]; total: number }
  | { tab: "ended"; auctions: EndedAuction[]; total: number }
  | { tab: "recent-bids"; bids: RecentBid[]; total: number }
  | { tab: "stats"; stats: AuctionStats; total: number };

const NO_SETS: string[] = [];

export default function AuctionsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [selectedPieces, setSelectedPieces] = useState<PieceIndex[]>([]);
  const [binFilter, setBinFilter] = useState<BinFilter>("all");
  const [tier, setTier] = useState<Tier>("");
  const [setName, setSetName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("timeleft");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [includeDyes, setIncludeDyes] = useState(true);

  const { state: setsState } = useAsyncData(fetchAuctionSets, []);
  const availableSets = setsState.status === "success" ? setsState.data : NO_SETS;

  // Each tab supports a different sort set, so the selection is corrected on
  // read rather than written back -- writing it forced a second render and
  // refetch on every tab change, and lost the previous tab's preference.
  const effectiveSort = useMemo(() => {
    if (tab === "active" && !["timeleft", "price"].includes(sortBy)) {
      return { sortBy: "timeleft", sortOrder: "asc" as const };
    }
    if ((tab === "ended" || tab === "stats") && !["timestamp", "price"].includes(sortBy)) {
      return { sortBy: "timestamp", sortOrder: "desc" as const };
    }
    return { sortBy, sortOrder };
  }, [tab, sortBy, sortOrder]);

  function togglePiece(piece: PieceIndex) {
    setSelectedPieces((prev) =>
      prev.includes(piece) ? prev.filter((p) => p !== piece) : [...prev, piece]
    );
  }

  function buildFilterParams(): AuctionFiltersParams {
    const params: AuctionFiltersParams = { limit: 50, include_dyes: includeDyes };
    if (selectedPieces.length > 0) params.pieces = selectedPieces;
    if (binFilter !== "all") params.bin_filter = binFilter;
    if (tier) params.tier = tier as "t1" | "t2" | "t3";
    if (setName) params.set_name = setName;
    if (minPrice) params.min_price = parseInt(minPrice);
    if (maxPrice) params.max_price = parseInt(maxPrice);
    return params;
  }

  async function loadTab(): Promise<ApiResult<TabData>> {
    if (tab === "recent-bids") {
      return mapResult(await fetchRecentBids(50, includeDyes), (bids) => ({
        tab: "recent-bids" as const,
        bids,
        total: bids.length,
      }));
    }

    const params = buildFilterParams();

    if (tab === "stats") {
      return mapResult(await fetchAuctionStats(params), (stats) => ({
        tab: "stats" as const,
        stats,
        total: stats.total,
      }));
    }

    params.sort_by = effectiveSort.sortBy;
    params.sort_order = effectiveSort.sortOrder;

    if (tab === "active") {
      return mapResult(await fetchActiveAuctions(params), ({ auctions, total }) => ({
        tab: "active" as const,
        auctions,
        total,
      }));
    }
    return mapResult(await fetchEndedAuctions(params), ({ auctions, total }) => ({
      tab: "ended" as const,
      auctions,
      total,
    }));
  }

  const { state } = useAsyncData(loadTab, [
    tab, selectedPieces, binFilter, tier, setName,
    minPrice, maxPrice, effectiveSort, includeDyes,
  ]);

  const total = state.status === "success" ? state.data.total : 0;

  return (
    <main className="min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-6 text-center">Auctions</h1>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex gap-1">
            <TabButton active={tab === "active"} onClick={() => setTab("active")}>
              Active
            </TabButton>
            <TabButton active={tab === "ended"} onClick={() => setTab("ended")}>
              Ended
            </TabButton>
            <TabButton active={tab === "recent-bids"} onClick={() => setTab("recent-bids")}>
              Recent Bids
            </TabButton>
            <TabButton active={tab === "stats"} onClick={() => setTab("stats")}>
              Stats
            </TabButton>
          </div>

          <Divider />

          <span className="text-[#888] text-[11px]">
            {tab === "recent-bids"
              ? "Live feed of recent bids"
              : tab === "stats"
              ? "Statistics based on filters"
              : `Browse ${tab === "active" ? "live" : "completed"} Seymour auctions`}
          </span>

          <Divider />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDyes}
              onChange={(e) => setIncludeDyes(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#5865F2] cursor-pointer"
            />
            <span className="text-[11px] text-[#888]">Include Dyes</span>
          </label>
        </div>

        {tab !== "recent-bids" && (
          <AuctionFilters
            tab={tab}
            selectedPieces={selectedPieces}
            binFilter={binFilter}
            tier={tier}
            setName={setName}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={effectiveSort.sortBy}
            sortOrder={effectiveSort.sortOrder}
            availableSets={availableSets}
            total={total}
            onTogglePiece={togglePiece}
            onClearPieces={() => setSelectedPieces([])}
            onBinFilterChange={setBinFilter}
            onTierChange={setTier}
            onSetNameChange={setSetName}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        )}

        {state.status === "error" ? (
          <div className="flex items-center justify-center py-12">
            <StatusMessage tone="error">{state.detail}</StatusMessage>
          </div>
        ) : tab === "stats" ? (
          <StatsPanel
            stats={state.status === "success" && state.data.tab === "stats" ? state.data.stats : null}
            loading={state.status === "loading"}
          />
        ) : state.status === "loading" ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#888] text-[14px]">Loading...</div>
          </div>
        ) : state.data.tab === "recent-bids" ? (
          <RecentBidsFeed bids={state.data.bids} />
        ) : state.data.tab === "active" || state.data.tab === "ended" ? (
          <AuctionsGrid auctions={state.data.auctions} isEnded={state.data.tab === "ended"} />
        ) : null}
      </div>
    </main>
  );
}
