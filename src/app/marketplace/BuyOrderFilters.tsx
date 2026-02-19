"use client";

import { OrderType, SortBy, SortOrder, Tier } from "@/types/marketplace";
import { FilterButton, PieceToggle } from "./ui";
import SortSelect from "./SortSelect";
import { PIECE_NAMES } from "./constants";

const TIER_LABELS: Record<Tier, string> = {
  [Tier.T1]: "T1",
  [Tier.T2]: "T2",
  [Tier.T3]: "T3",
};

interface BuyOrderFiltersProps {
  filterType: OrderType | null;
  filterSet: string | null;
  filterTier: Tier | null;
  filterPieces: number[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  sets: string[];
  onFilterTypeChange: (type: OrderType | null) => void;
  onFilterSetChange: (set: string | null) => void;
  onFilterTierChange: (tier: Tier | null) => void;
  onTogglePiece: (piece: number) => void;
  onClearPieces: () => void;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export default function BuyOrderFilters({
  filterType,
  filterSet,
  filterTier,
  filterPieces,
  sortBy,
  sortOrder,
  sets,
  onFilterTypeChange,
  onFilterSetChange,
  onFilterTierChange,
  onTogglePiece,
  onClearPieces,
  onSortByChange,
  onSortOrderChange,
}: BuyOrderFiltersProps) {
  const showSetPieceFilters = filterType === OrderType.SET_PIECE;

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          <FilterButton
            active={filterType === null}
            onClick={() => {
              onFilterTypeChange(null);
              onFilterSetChange(null);
              onFilterTierChange(null);
              onClearPieces();
            }}
          >
            All Types
          </FilterButton>
          <FilterButton
            active={filterType === OrderType.SET_PIECE}
            onClick={() => onFilterTypeChange(OrderType.SET_PIECE)}
          >
            Set Pieces
          </FilterButton>
          <FilterButton
            active={filterType === OrderType.HEX_PATTERN}
            onClick={() => {
              onFilterTypeChange(OrderType.HEX_PATTERN);
              onFilterSetChange(null);
              onFilterTierChange(null);
              onClearPieces();
            }}
          >
            Hex Patterns
          </FilterButton>
        </div>

        <div className="h-4 w-px bg-[#333]" />

        <SortSelect
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={onSortByChange}
          onSortOrderChange={onSortOrderChange}
        />
      </div>

      {showSetPieceFilters && (
        <div className="flex flex-wrap items-center gap-4 pl-1 border-l-2 border-[#5865F2]/30">
          {sets.length > 0 && (
            <select
              value={filterSet || ""}
              onChange={(e) => onFilterSetChange(e.target.value || null)}
              className="bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1 rounded border border-[#444] cursor-pointer"
            >
              <option value="">All Sets</option>
              {sets.map((set) => (
                <option key={set} value={set}>
                  {set}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1">
            {[null, ...Object.values(Tier)].map((tier) => (
              <FilterButton
                key={tier ?? "all"}
                active={filterTier === tier}
                onClick={() => onFilterTierChange(tier)}
              >
                {tier === null ? "All" : TIER_LABELS[tier]}
              </FilterButton>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {PIECE_NAMES.map((_, idx) => (
              <PieceToggle
                key={idx}
                pieceIndex={idx}
                selected={filterPieces.includes(idx)}
                onToggle={() => onTogglePiece(idx)}
              />
            ))}
            {filterPieces.length > 0 && (
              <button
                onClick={onClearPieces}
                className="text-[10px] text-[#666] hover:text-[#ccc] ml-1 border-none bg-transparent cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
