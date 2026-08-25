"use client";

import { PIECE_SLOT_NAMES } from "@/lib/pieces";

export function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-[11px] border-none cursor-pointer transition-colors ${
        active
          ? "bg-[#5865F2] text-white"
          : "bg-[#2a2a2a] text-[#888] hover:bg-[#333]"
      }`}
    >
      {children}
    </button>
  );
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-[11px] border-none cursor-pointer transition-colors ${
        active
          ? "bg-[#444] text-white"
          : "bg-transparent text-[#888] hover:text-[#ccc]"
      }`}
    >
      {children}
    </button>
  );
}

export function PieceToggle({
  pieceIndex,
  selected,
  onToggle,
}: {
  pieceIndex: number;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-2.5 py-1 rounded text-[10px] border-none cursor-pointer transition-colors ${
        selected
          ? "bg-purple-600/50 text-purple-200"
          : "bg-[#2a2a2a] text-[#888] hover:bg-[#333]"
      }`}
    >
      {PIECE_SLOT_NAMES[pieceIndex]}
    </button>
  );
}

export function SortSelect({
  sortBy,
  sortOrder,
  options,
  onSortByChange,
  onSortOrderChange,
}: {
  sortBy: string;
  sortOrder: "asc" | "desc";
  options: { value: string; label: string }[];
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#888] text-[11px]">Sort:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1.5 rounded border border-[#444] cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
        className="bg-[#2a2a2a] text-[#ccc] text-[11px] px-2 py-1.5 rounded border border-[#444] cursor-pointer"
      >
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>
    </div>
  );
}

export function Divider() {
  return <div className="h-4 w-px bg-[#333]" />;
}
