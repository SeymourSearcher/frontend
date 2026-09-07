"use client";

import type { HexUser } from "@/types/hex";
import { Avatar } from "@/components/Avatar";

interface UserChipProps {
  user: HexUser;
  /** Tier colour for the distance, since the chips are no longer grouped by tier. */
  deltaClassName?: string;
}

export function UserChip({ user, deltaClassName = "text-[#666]" }: UserChipProps) {
  return (
    <div className="flex items-center gap-2 bg-[#252525] rounded px-2 py-1 min-w-0">
      <Avatar user={user} size="sm" alt="" />
      <span className="text-[11px] text-[#ccc] truncate">{user.username}</span>
      <span className={`text-[10px] ml-auto shrink-0 ${deltaClassName}`}>{user.delta_e}</span>
    </div>
  );
}
