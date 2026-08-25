"use client";

import {
  TIER_OPTIONS,
  BIN_OPTIONS,
  ACTIVE_SORT_OPTIONS,
  ENDED_SORT_OPTIONS,
} from "./constants";
import { FilterButton } from "@/components/ui/FilterButton";
import { PieceToggle } from "@/components/ui/PieceToggle";
import { SortSelect } from "@/components/ui/SortSelect";
import { Divider } from "@/components/ui/Divider";
import { PIECE_INDEXES, PieceIndex } from "@/lib/pieces";

type Tab = "active" | "ended" | "stats";
type BinFilter = "all" | "bin" | "nobin";
type Tier = "t1" | "t2" | "t3" | "";

interface AuctionFiltersProps {
  tab: Tab;
  selectedPieces: PieceIndex[];
  binFilter: BinFilter;
  tier: Tier;
  setName: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  availableSets: string[];
  total: number;
  onTogglePiece: (piece: PieceIndex) => void;
  onClearPieces: () => void;
  onBinFilterChange: (filter: BinFilter) => void;
  onTierChange: (tier: Tier) => void;
  onSetNameChange: (setName: string) => void;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
}

export default function AuctionFilters({
  tab,
  selectedPieces,
  binFilter,
  tier,
  setName,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  availableSets,
  total,
  onTogglePiece,
  onClearPieces,
  onBinFilterChange,
  onTierChange,
  onSetNameChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortByChange,
  onSortOrderChange,
}: AuctionFiltersProps) {
  const sortOptions = tab === "active" ? ACTIVE_SORT_OPTIONS : ENDED_SORT_OPTIONS;
  const isStats = tab === "stats";

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {PIECE_INDEXES.map((piece) => (
            <PieceToggle
              key={piece}
              pieceIndex={piece}
              selected={selectedPieces.includes(piece)}
              onToggle={() => onTogglePiece(piece)}
            />
          ))}
          {selectedPieces.length > 0 && (
            <button
              onClick={onClearPieces}
              className="text-[10px] text-[#666] hover:text-[#ccc] ml-1 border-none bg-transparent cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <Divider />

        <div className="flex gap-1">
          {TIER_OPTIONS.map((opt) => (
            <FilterButton
              key={opt.value}
              active={tier === opt.value}
              onClick={() => onTierChange(opt.value as Tier)}
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>

        <Divider />

        <select
          value={setName}
          onChange={(e) => onSetNameChange(e.target.value)}
          className="bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1.5 rounded border border-[#444] cursor-pointer max-w-[140px]"
        >
          <option value="">All Sets</option>
          {availableSets.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {BIN_OPTIONS.map((opt) => (
            <FilterButton
              key={opt.value}
              active={binFilter === opt.value}
              onClick={() => onBinFilterChange(opt.value as BinFilter)}
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>

        <Divider />

        <div className="flex items-center gap-2">
          <span className="text-[#888] text-[11px]">Price:</span>
          <input
            type="text"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value.replace(/\D/g, ""))}
            className="w-[70px] bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1.5 rounded border border-[#444]"
          />
          <span className="text-[#666] text-[11px]">–</span>
          <input
            type="text"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value.replace(/\D/g, ""))}
            className="w-[70px] bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1.5 rounded border border-[#444]"
          />
        </div>

        {!isStats && (
          <>
            <Divider />
            <SortSelect
              sortBy={sortBy}
              sortOrder={sortOrder}
              options={sortOptions}
              onSortByChange={onSortByChange}
              onSortOrderChange={onSortOrderChange}
            />
          </>
        )}

        <div className="flex-1" />

        <span className="text-[#666] text-[11px]">
          {total} {tab === "active" ? "active" : tab === "stats" ? "ended (for stats)" : "ended"} auctions
        </span>
      </div>
    </div>
  );
}
