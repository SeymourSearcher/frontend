"use client";

import { useState } from "react";
import type { HexUser } from "@/types/hex";
import { TIER_CONFIG, TierKey } from "./tierConfig";
import { UserChip } from "./UserChip";

export function TierSection({ tier, users }: { tier: TierKey; users: HexUser[] }) {
  const [expanded, setExpanded] = useState(false);
  const config = TIER_CONFIG[tier];

  if (users.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 text-[12px] ${config.color} cursor-pointer bg-transparent border-none`}
      >
        <span>{expanded ? "▼" : "▶"}</span>
        <span>{config.label}</span>
        <span className="text-[#666]">({users.length})</span>
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-2 mt-2">
          {users.map((user) => (
            <UserChip key={user.discord_id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
