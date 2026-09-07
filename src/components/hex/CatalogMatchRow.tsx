"use client";

import Link from "next/link";
import type { HexMatch } from "@/types/hex";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { ColorSwatch } from "@/components/ui/ColorSwatch";

/** Reference only: the owners it counts are listed on that colour's own page. */
export function CatalogMatchRow({ match, rank }: { match: HexMatch; rank: number }) {
  return (
    <Link
      href={`/hex/${match.target_hex}`}
      className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2c2c2c] rounded px-3 py-2 no-underline hover:border-[#444] transition-colors"
    >
      <span className="text-[#666] text-[11px] w-5">#{rank}</span>
      <ColorSwatch hex={match.target_hex} size="md" />
      <div className="min-w-0">
        <p className="text-[#eee] text-[12px] truncate">{match.target_name}</p>
        <p className="text-[#666] text-[10px]">
          {match.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")}
        </p>
      </div>
      <span className="text-[#888] text-[11px]" style={{ color: `#${match.target_hex}` }}>
        #{match.target_hex}
      </span>
      <span className="ml-auto text-[#aaa] text-[11px]">ΔE {match.delta_e}</span>
      <span className="text-[#666] text-[11px] w-[70px] text-right">
        {match.owner_count} owner{match.owner_count === 1 ? "" : "s"}
      </span>
      <span className="text-[#555] text-[12px]">›</span>
    </Link>
  );
}
