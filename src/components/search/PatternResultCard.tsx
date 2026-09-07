"use client";

import Link from "next/link";

import { Avatar } from "@/components/Avatar";
import { MinecraftItem } from "@/components/ui/MinecraftItem";
import { TIER_CONFIG, type TierKey } from "@/components/hex/tierConfig";
import { PIECE_SLOT_NAMES, type PieceIndex } from "@/lib/pieces";
import type { HexSearchOwner, HexSearchResult } from "@/types/hexSearch";

const MAX_AVATARS = 4;

/**
 * A pattern row is a colour, not a piece, so there is no slot to render. Show
 * the one someone actually holds it on when anybody does, and fall back to the
 * helmet as the canonical shape when nobody does.
 */
function displayPiece(owners: HexSearchOwner[]): PieceIndex {
  return owners[0]?.pieces[0] ?? 0;
}

function ownerTitle(owners: HexSearchOwner[]): string {
  return owners
    .map((o) => `${o.username} (${o.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")})`)
    .join("\n");
}

export function PatternResultCard({ result }: { result: HexSearchResult }) {
  const tierColor = result.tier ? TIER_CONFIG[result.tier as TierKey].color : "text-[#666]";
  const shown = result.owners.slice(0, MAX_AVATARS);

  return (
    <Link href={`/hex/${result.hex_code}`} className="block">
      <div className="bg-[#1a1a1a] rounded-lg p-3 flex flex-col items-center hover:bg-[#252525] transition-colors cursor-pointer h-full">
        <MinecraftItem piece={displayPiece(result.owners)} hex={result.hex_code} scale={3} />

        <span className="text-[11px] mt-2 mb-1 font-bold" style={{ color: `#${result.hex_code}` }}>
          #{result.hex_code}
        </span>

        <span className="text-[#5865F2] text-[9px] text-center leading-tight">
          {result.target_name ?? `#${result.target_hex}`}
        </span>
        <span className={`text-[8px] ${tierColor}`}>
          ΔE: {result.delta_e}
          {result.tier && ` · ${result.tier.toUpperCase()}`}
        </span>

        {/* Always rendered so an unowned tile is the same height as an owned one. */}
        <div className="flex items-center justify-center gap-1 mt-2 h-4">
          {result.owner_count === 0 ? (
            <span className="text-[8px] text-[#555]">unowned</span>
          ) : (
            <span className="flex items-center gap-1" title={ownerTitle(result.owners)}>
              {shown.map((owner) => (
                <Avatar key={owner.discord_id} user={owner} size="sm" alt="" />
              ))}
              {result.owner_count > MAX_AVATARS && (
                <span className="text-[8px] text-[#888]">
                  +{result.owner_count - MAX_AVATARS}
                </span>
              )}
            </span>
          )}
        </div>

        {result.owner_count > 0 && (
          <span className="text-[8px] text-[#666] mt-1 truncate max-w-full">
            {result.owner_count === 1
              ? result.owners[0].username
              : `${result.owner_count} owners`}
          </span>
        )}
      </div>
    </Link>
  );
}
