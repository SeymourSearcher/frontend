"use client";

import { PIECE_INDEXES, PIECE_SLOT_NAMES, type PieceIndex } from "@/lib/pieces";

const CHIP =
  "text-[11px] px-3 py-1 rounded border cursor-pointer font-['MinecraftSeven',Arial,sans-serif] transition-colors";
const ON = "bg-[#5865F2] border-[#5865F2] text-white";
const OFF = "bg-[#1a1a1a] border-[#333] text-[#888] hover:border-[#555]";

interface PieceFilterProps {
  selected: PieceIndex[];
  onChange: (pieces: PieceIndex[]) => void;
}

/** Empty selection means every slot, so "All" is the absence of a filter. */
export function PieceFilter({ selected, onChange }: PieceFilterProps) {
  function toggle(piece: PieceIndex) {
    onChange(
      selected.includes(piece)
        ? selected.filter((p) => p !== piece)
        : [...selected, piece]
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        className={`${CHIP} ${selected.length === 0 ? ON : OFF}`}
        onClick={() => onChange([])}
      >
        All
      </button>
      {PIECE_INDEXES.map((piece) => (
        <button
          key={piece}
          className={`${CHIP} ${selected.includes(piece) ? ON : OFF}`}
          onClick={() => toggle(piece)}
        >
          {PIECE_SLOT_NAMES[piece]}
        </button>
      ))}
    </div>
  );
}
