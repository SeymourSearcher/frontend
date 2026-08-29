"use client";

import Link from "next/link";
import { Seymour } from "@/types/seymour";
import { PIECE_ITEM_NAMES } from "@/lib/pieces";
import { MinecraftItem } from "@/components/ui/MinecraftItem";

interface SeymourCardProps {
  seymour: Seymour;
  sellMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

const CARD_CLASSES =
  "bg-[#1a1a1a] rounded-lg p-3 flex flex-col items-center hover:bg-[#252525] transition-colors cursor-pointer";

export default function SeymourCard({ seymour, sellMode, isSelected, onSelect }: SeymourCardProps) {
  const body = (
    <>
      <MinecraftItem piece={seymour.item_name} hex={seymour.hex_color} scale={3} />
      <span className="text-[11px] mt-2 mb-1 font-bold" style={{ color: `#${seymour.hex_color}` }}>
        #{seymour.hex_color}
      </span>
      <span className="text-[#888] text-[9px] mb-1">{PIECE_ITEM_NAMES[seymour.item_name]}</span>
      {seymour.match && (
        <div className="text-center mt-1">
          <span className="text-[#5865F2] text-[9px] block">{seymour.match.target_name}</span>
          <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>
        </div>
      )}
    </>
  );

  if (sellMode) {
    return (
      <div
        onClick={() => onSelect?.(seymour.id)}
        className={`${CARD_CLASSES} relative ${isSelected ? "ring-2 ring-[#5865F2]" : ""}`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="absolute top-2 right-2 w-4 h-4 accent-[#5865F2] pointer-events-none"
        />
        {body}
      </div>
    );
  }

  return (
    <Link href={`/hex/${seymour.hex_color}`} className="block">
      <div className={CARD_CLASSES}>{body}</div>
    </Link>
  );
}
