"use client";

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { TIER_CONFIG, type TierKey } from "@/components/hex/tierConfig";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import type { HexSearchOwner, HexSearchResult } from "@/types/hexSearch";

const MAX_CHIPS = 4;

function OwnerChip({ owner }: { owner: HexSearchOwner }) {
  const slots = owner.pieces.map((p) => PIECE_SLOT_NAMES[p][0]).join("");
  return (
    <div
      className="flex items-center gap-1.5 bg-[#252525] rounded px-2 py-1 min-w-0"
      title={`${owner.username} — ${owner.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")}`}
    >
      <Avatar user={owner} size="sm" alt="" />
      <span className="text-[11px] text-[#ccc] truncate">{owner.username}</span>
      <span className="text-[10px] text-[#666] shrink-0">
        {slots}
        {owner.quantity > owner.pieces.length && ` ×${owner.quantity}`}
      </span>
    </div>
  );
}

export function PatternResultRow({ result }: { result: HexSearchResult }) {
  const tierColor = result.tier ? TIER_CONFIG[result.tier as TierKey].color : "text-[#666]";
  const shown = result.owners.slice(0, MAX_CHIPS);

  return (
    <Link
      href={`/hex/${result.hex_code}`}
      className="flex items-center gap-3 bg-[#1a1a1a] border border-[#2c2c2c] rounded p-3 hover:border-[#444] transition-colors"
    >
      <div
        className="w-10 h-10 rounded border border-[#333] shrink-0"
        style={{ backgroundColor: `#${result.hex_code}` }}
      />

      <div className="min-w-0 flex-1">
        <div className="text-[14px] text-[#eee]">#{result.hex_code}</div>
        <div className="text-[11px] text-[#888] truncate">
          {result.target_name ?? `#${result.target_hex}`}
        </div>
      </div>

      <div className="text-right shrink-0 w-16">
        <div className={`text-[13px] ${tierColor}`}>ΔE {result.delta_e}</div>
        <div className="text-[10px] text-[#666] uppercase">{result.tier ?? "—"}</div>
      </div>

      {/* Reserved so rows with no owners keep the same height as rows with them. */}
      <div className="hidden sm:flex items-center gap-1 w-[280px] shrink-0 justify-end">
        {result.owner_count === 0 ? (
          <span className="text-[11px] text-[#555]">unowned</span>
        ) : (
          <>
            {shown.map((owner) => (
              <OwnerChip key={owner.discord_id} owner={owner} />
            ))}
            {result.owner_count > MAX_CHIPS && (
              <span className="text-[11px] text-[#888] shrink-0">
                +{result.owner_count - MAX_CHIPS}
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
