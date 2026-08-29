"use client";

import Link from "next/link";
import { Seymour } from "@/types/seymour";
import { PIECE_ITEM_NAMES } from "@/lib/pieces";
import { MinecraftItem } from "@/components/ui/MinecraftItem";

interface SeymourChipProps {
  seymour: Seymour;
  sellMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

const CHIP_CLASSES =
  "flex items-center gap-2 bg-[#252525] rounded px-3 py-2 hover:bg-[#333] transition-colors cursor-pointer";

export default function SeymourChip({ seymour, sellMode, isSelected, onSelect }: SeymourChipProps) {
  const body = (
    <>
      <MinecraftItem piece={seymour.item_name} hex={seymour.hex_color} scale={2} slot={false} />
      <div className="flex flex-col">
        <span className="text-[11px] font-bold" style={{ color: `#${seymour.hex_color}` }}>
          #{seymour.hex_color}
        </span>
        <span className="text-[#888] text-[9px]">{PIECE_ITEM_NAMES[seymour.item_name]}</span>
        {seymour.match && <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>}
      </div>
    </>
  );

  if (sellMode) {
    return (
      <div
        onClick={() => onSelect?.(seymour.id)}
        className={`${CHIP_CLASSES} relative ${isSelected ? "ring-2 ring-[#5865F2]" : ""}`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 accent-[#5865F2] pointer-events-none"
        />
        {body}
      </div>
    );
  }

  return (
    <Link href={`/hex/${seymour.hex_color}`} className="block">
      <div className={CHIP_CLASSES}>{body}</div>
    </Link>
  );
}
