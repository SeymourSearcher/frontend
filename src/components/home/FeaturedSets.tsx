import Link from "next/link";
import type { FeaturedSet } from "@/types/stats";
import { Avatar } from "@/components/Avatar";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";

function SetTile({ set }: { set: FeaturedSet }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      {/* Butted against each other rather than spaced: the point of the tile is
          how little the four colours differ. */}
      <div className="flex h-20">
        {set.hexes.map((hex, piece) => (
          <Link
            key={piece}
            href={`/hex/${hex}`}
            title={`${PIECE_SLOT_NAMES[piece]} — #${hex}`}
            aria-label={`${PIECE_SLOT_NAMES[piece]} #${hex}`}
            className="flex-1 transition-[filter] hover:brightness-125"
            style={{ backgroundColor: `#${hex}` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar user={set} size="sm" alt="" />
          <span className="text-[#ccc] text-[11px] truncate">{set.username}</span>
        </div>
        <span className="text-green-400 text-[11px] shrink-0">ΔE {set.avg_delta_e}</span>
      </div>
    </div>
  );
}

export function FeaturedSets({ sets }: { sets: FeaturedSet[] }) {
  if (sets.length === 0) return null;

  return (
    <section className="max-w-[900px] mx-auto px-6 mt-14 font-['MinecraftSeven',Arial,sans-serif]">
      <h2 className="text-[#f0f0f0] text-[14px] mb-1">Featured Custom Sets</h2>
      <p className="text-[#666] text-[11px] mb-4">
        The closest-matched four-piece sets on the site. Click a piece to see who else owns that colour.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sets.map((set) => (
          <SetTile key={`${set.discord_id}-${set.hexes.join("")}`} set={set} />
        ))}
      </div>
    </section>
  );
}
