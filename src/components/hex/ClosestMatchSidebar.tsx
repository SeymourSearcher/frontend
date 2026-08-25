"use client";

import { HexMatch } from "@/lib/api";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { TIER_CONFIG, TierKey } from "./tierConfig";

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

function calculateAbs(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

export function ClosestMatchSidebar({ match, searchHex }: { match: HexMatch; searchHex: string }) {
  const absValue = calculateAbs(searchHex, match.target_hex);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 lg:sticky lg:top-6">
      <h3 className="text-[#888] text-[11px] uppercase tracking-wider mb-4">Closest Match</h3>
      
      <div className="flex gap-3 mb-4 justify-center lg:justify-start">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded border border-[#333]" style={{ backgroundColor: `#${searchHex}` }} />
          <span className="text-[9px] text-[#666] mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#666]">
          <span className="text-[16px]">→</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded border border-[#333]" style={{ backgroundColor: `#${match.target_hex}` }} />
          <span className="text-[9px] text-[#666] mt-1">Match</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-[#f0f0f0] text-[14px] font-bold">{match.target_name}</div>
        <div className="text-[11px] font-bold mt-1" style={{ color: `#${match.target_hex}` }}>
          #{match.target_hex}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#252525] rounded p-3 text-center">
          <div className="text-[10px] text-[#666] uppercase">Delta E</div>
          <div className="text-[20px] text-[#5865F2] font-bold">{match.delta_e}</div>
        </div>
        <div className="bg-[#252525] rounded p-3 text-center">
          <div className="text-[10px] text-[#666] uppercase">ABS</div>
          <div className="text-[20px] text-[#5865F2] font-bold">{absValue}</div>
        </div>
      </div>

      <div className="text-[10px] text-[#888] mb-3">
        Pieces: {match.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")}
      </div>

      <div className="border-t border-[#333] pt-3">
        <div className="text-[10px] text-[#666] uppercase mb-2">Users by Tier</div>
        <div className="space-y-2">
          {(["t1", "t2", "t3"] as const).map((tier) => {
            const users = match.users_by_tier[tier];
            const config = TIER_CONFIG[tier as TierKey];
            return (
              <div key={tier} className="flex items-center justify-between">
                <span className={`text-[11px] ${config.color}`}>{config.label}</span>
                <span className="text-[11px] text-[#f0f0f0]">{users.length}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
