"use client";

import { SortBy, SortOrder } from "@/types/marketplace";
import { FilterButton } from "./ui";
import SortSelect from "./SortSelect";
import { PIECE_NAMES } from "./constants";

interface SellOrderFiltersProps {
  sellFilterPiece: number | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onFilterPieceChange: (piece: number | null) => void;
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
          active={sellFilterPiece === null}
          onClick={() => onFilterPieceChange(null)}
        >
          All
        </FilterButton>
        {PIECE_NAMES.map((name, idx) => (
          <FilterButton
            key={idx}
            active={sellFilterPiece === idx}
            onClick={() => onFilterPieceChange(idx)}
          >
            {name}
          </FilterButton>
        ))}
      </div>

      <div className="h-4 w-px bg-[#333]" />

      <SortSelect
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={onSortByChange}
        onSortOrderChange={onSortOrderChange}
        showDeltaE
      />
    </div>
  );
}
