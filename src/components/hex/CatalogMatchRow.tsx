"use client";

import { useState } from "react";
import Link from "next/link";
import type { HexMatch } from "@/types/hex";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { TierBadge } from "./TierBadge";
import { TierSection } from "./TierSection";

/** Shared with the loading skeleton so the strip does not resize on load. */
export const CATALOG_ROW_HEIGHT = "h-[52px]";

export function CatalogMatchRow({ match, rank }: { match: HexMatch; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const tiers = match.users_by_tier;
  const total = tiers.t1.length + tiers.t2.length + tiers.t3.length;

  return (
    <div className="bg-[#1a1a1a] border border-[#2c2c2c] rounded">
      <div className="flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          disabled={total === 0}
          className={`flex-1 min-w-0 flex items-center gap-3 px-3 bg-transparent border-none cursor-pointer disabled:cursor-default text-left font-['MinecraftSeven',Arial,sans-serif] ${CATALOG_ROW_HEIGHT}`}
        >
          <span className="text-[#666] text-[11px] w-5">#{rank}</span>
          <ColorSwatch hex={match.target_hex} size="md" />
          <div className="min-w-0">
            <p className="text-[#eee] text-[12px] truncate">{match.target_name}</p>
            <p className="text-[#666] text-[10px]">
              {match.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")}
            </p>
          </div>
          <span className="text-[11px]" style={{ color: `#${match.target_hex}` }}>
            #{match.target_hex}
          </span>
          <span className="ml-auto text-[#aaa] text-[11px]">ΔE {match.delta_e}</span>
          <span className="flex items-center gap-1">
            <TierBadge tier="t1" count={tiers.t1.length} />
            <TierBadge tier="t2" count={tiers.t2.length} />
            <TierBadge tier="t3" count={tiers.t3.length} />
          </span>
          <span className="text-[#555] text-[10px] w-3">
            {total === 0 ? "" : expanded ? "▼" : "▶"}
          </span>
        </button>
        <Link
          href={`/hex/${match.target_hex}`}
          aria-label={`Search ${match.target_hex}`}
          className="text-[#555] hover:text-[#999] text-[14px] no-underline px-3 py-2"
        >
          ›
        </Link>
      </div>

      {expanded && (
        <div className="px-3 pb-3">
          <TierSection tier="t1" users={tiers.t1} />
          <TierSection tier="t2" users={tiers.t2} />
          <TierSection tier="t3" users={tiers.t3} />
        </div>
      )}
    </div>
  );
}
