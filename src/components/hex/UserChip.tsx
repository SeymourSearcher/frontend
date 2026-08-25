"use client";

import { HexUser } from "@/lib/api";
import { Avatar } from "@/components/Avatar";

export function UserChip({ user }: { user: HexUser }) {
  return (
    <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2">
      <Avatar user={user} />
      <span className="text-[12px] text-[#ccc]">{user.username}</span>
      <span className="text-[10px] text-[#666]">ΔE: {user.delta_e}</span>
    </div>
  );
}
