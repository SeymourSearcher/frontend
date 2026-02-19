import { SortBy, SortOrder } from "@/types/marketplace";

interface SortSelectProps {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  showDeltaE?: boolean;
}

export default function SortSelect({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  showDeltaE = false,
}: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#888] text-[11px]">Sort:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortBy)}
        className="bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1 rounded border border-[#444] cursor-pointer"
      >
        <option value="price">Price</option>
        <option value="expires_at">Expires</option>
        {showDeltaE && <option value="delta_e">Delta E</option>}
      </select>
      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        className="bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1 rounded border border-[#444] cursor-pointer"
      >
        <option value="desc">High to Low</option>
        <option value="asc">Low to High</option>
      </select>
    </div>
  );
}
