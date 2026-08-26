"use client";

import type { HexMatch } from "@/types/hex";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { TierBadge } from "./TierBadge";
import { TierSection } from "./TierSection";

export function MatchCard({ match, rank }: { match: HexMatch; rank: number }) {
  const totalUsers = match.users_by_tier.t1.length + match.users_by_tier.t2.length + match.users_by_tier.t3.length;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[#666] text-[14px]">#{rank}</span>
          <div
            className="w-10 h-10 rounded shrink-0"
            style={{ backgroundColor: `#${match.target_hex}` }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-[#f0f0f0] text-[14px] truncate">{match.target_name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold" style={{ color: `#${match.target_hex}` }}>
                #{match.target_hex}
              </span>
              <span className="text-[#666] text-[10px]">ΔE: {match.delta_e}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap sm:ml-auto">
          <TierBadge tier="t1" count={match.users_by_tier.t1.length} />
          <TierBadge tier="t2" count={match.users_by_tier.t2.length} />
          <TierBadge tier="t3" count={match.users_by_tier.t3.length} />
        </div>
      </div>
      <div className="text-[10px] text-[#888] mb-3 break-words">
        Pieces: {match.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")}
      </div>
      <TierSection tier="t1" users={match.users_by_tier.t1} />
      <TierSection tier="t2" users={match.users_by_tier.t2} />
      <TierSection tier="t3" users={match.users_by_tier.t3} />
      {totalUsers === 0 && (
        <p className="text-[#666] text-[11px] mt-2">No users have matching pieces</p>
      )}
    </div>
  );
}
