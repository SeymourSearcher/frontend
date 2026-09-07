"use client";

import Link from "next/link";

import { Avatar } from "@/components/Avatar";
import { MinecraftItem } from "@/components/ui/MinecraftItem";
import { TIER_CONFIG, type TierKey } from "@/components/hex/tierConfig";
import { PIECE_SLOT_NAMES, type PieceIndex } from "@/lib/pieces";
import type { HexSearchOwner, HexSearchResult } from "@/types/hexSearch";

const MAX_OWNERS = 3;

/**
 * A row is a colour, not a piece, so there is no slot of its own to draw. Every
 * row is held by someone, so show the piece its first owner holds it on.
 */
function displayPiece(owners: HexSearchOwner[]): PieceIndex {
  return owners[0]?.pieces[0] ?? 0;
}

function slots(owner: HexSearchOwner): string {
  return owner.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ");
}

function OwnerLine({ owner }: { owner: HexSearchOwner }) {
  return (
    <div
      className="flex items-center gap-1.5 min-w-0 w-full"
      title={`${owner.username} — ${slots(owner)}`}
    >
      <Avatar user={owner} size="sm" alt="" />
      <span className="text-[9px] text-[#ccc] truncate">{owner.username}</span>
      {owner.quantity > 1 && (
        <span className="text-[8px] text-[#666] ml-auto shrink-0">×{owner.quantity}</span>
      )}
    </div>
  );
}

export function PatternResultCard({ result }: { result: HexSearchResult }) {
  const tierColor = result.tier ? TIER_CONFIG[result.tier as TierKey].color : "text-[#666]";
  const shown = result.owners.slice(0, MAX_OWNERS);

  return (
    <Link href={`/hex/${result.hex_code}`} className="block">
      <div
        className={`bg-[#1a1a1a] rounded-lg p-3 flex flex-col items-center hover:bg-[#252525] transition-colors cursor-pointer h-full ${
          result.owned_by_me ? "ring-1 ring-[#5865F2]" : ""
        }`}
      >
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

        {result.owned_by_me && (
          <span className="text-[8px] text-[#5865F2] mt-1">You own this</span>
        )}

        <div className="flex flex-col gap-1 mt-2 w-full">
          {shown.map((owner) => (
            <OwnerLine key={owner.discord_id} owner={owner} />
          ))}
          {result.owner_count > MAX_OWNERS && (
            <span className="text-[8px] text-[#666]">
              +{result.owner_count - MAX_OWNERS} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
