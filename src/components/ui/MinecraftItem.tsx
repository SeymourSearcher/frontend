"use client";

import { useMemo } from "react";
import { PIECE_SLOT_NAMES, type PieceIndex } from "@/lib/pieces";
import { tintPieceTexture } from "@/lib/itemTexture";

/** Integer multiples of the 16px source only -- fractional scaling makes pixel art uneven. */
const BOX_CLASSES = {
  1: "w-4 h-4",
  2: "w-8 h-8",
  3: "w-12 h-12",
} as const;

interface MinecraftItemProps {
  piece: PieceIndex;
  hex: string;
  scale: keyof typeof BOX_CLASSES;
  slot?: boolean;
}

export function MinecraftItem({ piece, hex, scale, slot = true }: MinecraftItemProps) {
  const src = useMemo(() => tintPieceTexture(piece, hex), [piece, hex]);

  return (
    <div
      className={`${BOX_CLASSES[scale]} shrink-0 ${
        // Inset shadow rather than a border: a border eats into the content box and breaks integer scaling.
        slot ? "bg-[#2a2a2a] rounded shadow-[inset_0_0_0_1px_#333]" : ""
      }`}
    >
      {src && (
        <img
          src={src}
          alt={`${PIECE_SLOT_NAMES[piece]} dyed #${hex}`}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
        />
      )}
    </div>
  );
}
