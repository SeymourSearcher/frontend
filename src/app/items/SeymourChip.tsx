"use client";

import Link from "next/link";
import { Seymour } from "@/types/seymour";

interface SeymourChipProps {
  seymour: Seymour;
  sellMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

export default function SeymourChip({ seymour, sellMode, isSelected, onSelect }: SeymourChipProps) {
  if (sellMode) {
    return (
      <div
        onClick={() => onSelect?.(seymour.id)}
        className={`flex items-center gap-2 bg-[#252525] rounded px-3 py-2 hover:bg-[#333] transition-colors cursor-pointer relative ${
          isSelected ? "ring-2 ring-[#5865F2]" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 accent-[#5865F2] pointer-events-none"
        />
        <div className="w-6 h-6 rounded" style={{ backgroundColor: `#${seymour.hex_color}` }} />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold" style={{ color: `#${seymour.hex_color}` }}>
            #{seymour.hex_color}
          </span>
          <span className="text-[#888] text-[9px]">{seymour.item_name}</span>
          {seymour.match && <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>}
        </div>
      </div>
    );
  }

  return (
    <Link href={`/hex/${seymour.hex_color}`} className="block">
      <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2 hover:bg-[#333] transition-colors cursor-pointer">
        <div className="w-6 h-6 rounded" style={{ backgroundColor: `#${seymour.hex_color}` }} />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold" style={{ color: `#${seymour.hex_color}` }}>
            #{seymour.hex_color}
          </span>
          <span className="text-[#888] text-[9px]">{seymour.item_name}</span>
          {seymour.match && <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>}
        </div>
      </div>
    </Link>
  );
}
