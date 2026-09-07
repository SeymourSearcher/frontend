"use client";

import { FilterButton } from "@/components/ui/FilterButton";
import { PieceFilter } from "@/components/hex/PieceFilter";
import { TIER_KEYS } from "@/components/hex/tierConfig";
import type { PieceIndex } from "@/lib/pieces";
import type { HexStatsTier } from "@/types/hex";

interface PatternFiltersProps {
  includeDyes: boolean;
  onIncludeDyesChange: (value: boolean) => void;
  mineOnly: boolean;
  onMineOnlyChange: (value: boolean) => void;
  /** Nothing to narrow to when logged out, so the toggle is unavailable. */
  canFilterMine: boolean;
  tier: HexStatsTier;
  onTierChange: (tier: HexStatsTier) => void;
  pieces: PieceIndex[];
  onPiecesChange: (pieces: PieceIndex[]) => void;
}

export function PatternFilters({
  includeDyes,
  onIncludeDyesChange,
  mineOnly,
  onMineOnlyChange,
  canFilterMine,
  tier,
  onTierChange,
  pieces,
  onPiecesChange,
}: PatternFiltersProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <FilterButton active={tier === "all"} onClick={() => onTierChange("all")}>
          All tiers
        </FilterButton>
        {TIER_KEYS.map((key) => (
          <FilterButton key={key} active={tier === key} onClick={() => onTierChange(key)}>
            {key.toUpperCase()}
          </FilterButton>
        ))}

        <div className="w-px h-5 bg-[#333] mx-1" />

        {canFilterMine && (
          <FilterButton active={mineOnly} onClick={() => onMineOnlyChange(!mineOnly)}>
            {mineOnly ? "Mine" : "Everyone"}
          </FilterButton>
        )}

        <label className="flex items-center gap-2 text-[12px] text-[#888] cursor-pointer ml-1">
          <input
            type="checkbox"
            checked={includeDyes}
            onChange={(e) => onIncludeDyesChange(e.target.checked)}
            className="w-4 h-4 accent-[#5865F2]"
          />
          Include Dyes
        </label>
      </div>

      <PieceFilter selected={pieces} onChange={onPiecesChange} />

      {/* The asymmetry is deliberate but invisible; unlabelled it reads as a bug. */}
      <p className="text-[11px] text-[#666] -mt-2">
        Results are colours someone owns. Slots filter owners only — ΔE is always the
        global nearest match.
      </p>
    </div>
  );
}
