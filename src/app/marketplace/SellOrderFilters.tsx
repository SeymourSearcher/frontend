"use client";

import { SortBy, SortOrder } from "@/types/marketplace";
import { FilterButton } from "@/components/ui/FilterButton";
import { SortSelect } from "@/components/ui/SortSelect";
import { SELL_SORT_OPTIONS } from "./constants";
import { PIECE_INDEXES, PIECE_SLOT_NAMES, PieceIndex } from "@/lib/pieces";

interface SellOrderFiltersProps {
  sellFilterPiece: PieceIndex | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onFilterPieceChange: (piece: PieceIndex | null) => void;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
}

export default function SellOrderFilters({
  sellFilterPiece,
  sortBy,
  sortOrder,
  onFilterPieceChange,
  onSortByChange,
  onSortOrderChange,
}: SellOrderFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-1">
        <FilterButton
          size="compact"
          tone="bright"
          active={sellFilterPiece === null}
          onClick={() => onFilterPieceChange(null)}
        >
          All
        </FilterButton>
        {PIECE_INDEXES.map((piece) => (
          <FilterButton
          size="compact"
          tone="bright"
            key={piece}
            active={sellFilterPiece === piece}
            onClick={() => onFilterPieceChange(piece)}
          >
            {PIECE_SLOT_NAMES[piece]}
          </FilterButton>
        ))}
      </div>

      <div className="h-4 w-px bg-[#333]" />

      <SortSelect
        sortBy={sortBy}
        sortOrder={sortOrder}
        options={SELL_SORT_OPTIONS}
        onSortByChange={onSortByChange}
        onSortOrderChange={onSortOrderChange}
        size="compact"
        orderFirst="desc"
      />
    </div>
  );
}
