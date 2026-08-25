"use client";

import { useState, useEffect } from "react";
import { fetchActiveAuctions, fetchEndedAuctions, fetchRecentBids, fetchAuctionSets, fetchAuctionStats } from "@/lib/api";
import type { RecentBid } from "@/lib/api";
import type { ActiveAuction, EndedAuction, AuctionFilters as AuctionFiltersParams, AuctionStats } from "@/types/auction";
import AuctionsGrid from "./AuctionsGrid";
import AuctionFilters from "./AuctionFilters";
import RecentBidsFeed from "./RecentBidsFeed";
import StatsPanel from "./StatsPanel";
import { TabButton, Divider } from "./ui";
import { PieceIndex } from "@/lib/pieces";

type Tab = "active" | "ended" | "recent-bids" | "stats";
type BinFilter = "all" | "bin" | "nobin";
type Tier = "t1" | "t2" | "t3" | "";

export default function AuctionsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [activeAuctions, setActiveAuctions] = useState<ActiveAuction[]>([]);
  const [endedAuctions, setEndedAuctions] = useState<EndedAuction[]>([]);
  const [stats, setStats] = useState<AuctionStats | null>(null);
  const [recentBids, setRecentBids] = useState<RecentBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [selectedPieces, setSelectedPieces] = useState<PieceIndex[]>([]);
  const [binFilter, setBinFilter] = useState<BinFilter>("all");
  const [tier, setTier] = useState<Tier>("");
  const [setName, setSetName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("timeleft");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [availableSets, setAvailableSets] = useState<string[]>([]);
  const [includeDyes, setIncludeDyes] = useState(true);

  useEffect(() => {
    fetchAuctionSets().then((sets) => setAvailableSets(sets || []));
  }, []);

  function getEffectiveSort(currentTab: Tab) {
    if (currentTab === "active" && !["timeleft", "price"].includes(sortBy)) {
      return { sortBy: "timeleft", sortOrder: "asc" as const };
    }
    if (currentTab === "ended" && !["timestamp", "price"].includes(sortBy)) {
      return { sortBy: "timestamp", sortOrder: "desc" as const };
    }
    return { sortBy, sortOrder };
  }

  useEffect(() => {
    if (tab === "active" && !["timeleft", "price"].includes(sortBy)) {
      setSortBy("timeleft");
      setSortOrder("asc");
      return;
    }
    if ((tab === "ended" || tab === "stats") && !["timestamp", "price"].includes(sortBy)) {
      setSortBy("timestamp");
      setSortOrder("desc");
      return;
    }
    loadAuctions();
  }, [tab, selectedPieces, binFilter, tier, setName, minPrice, maxPrice, sortBy, sortOrder, includeDyes]);

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

  async function loadAuctions() {
    setLoading(true);

    if (tab === "recent-bids") {
      const data = await fetchRecentBids(50, includeDyes);
      setRecentBids(data || []);
      setTotal(data?.length || 0);
      setLoading(false);
      return;
    }

    if (tab === "stats") {
      const params = buildFilterParams();
      const data = await fetchAuctionStats(params);
      setStats(data);
      setTotal(data?.total || 0);
      setLoading(false);
      return;
    }

    const effective = getEffectiveSort(tab);
    const params = buildFilterParams();
    params.sort_by = effective.sortBy;
    params.sort_order = effective.sortOrder;

    if (tab === "active") {
      const data = await fetchActiveAuctions(params);
      setActiveAuctions(data?.auctions || []);
      setTotal(data?.total || 0);
    } else {
      const data = await fetchEndedAuctions(params);
      setEndedAuctions(data?.auctions || []);
      setTotal(data?.total || 0);
    }
    setLoading(false);
  }

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
            sortBy={sortBy}
            sortOrder={sortOrder}
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

        {tab === "stats" ? (
          <StatsPanel stats={stats} loading={loading} />
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#888] text-[14px]">Loading...</div>
          </div>
        ) : tab === "recent-bids" ? (
          <RecentBidsFeed bids={recentBids} />
        ) : (
          <AuctionsGrid
            auctions={tab === "active" ? activeAuctions : endedAuctions}
            isEnded={tab === "ended"}
          />
        )}
      </div>
    </main>
  );
}
