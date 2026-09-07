import type { HexUser } from "@/types/hex";
import { TIER_CONFIG, TierKey } from "./tierConfig";
import { UserChip } from "./UserChip";

/** Rendered only inside an already-expanded row, so it carries no toggle. */
export function TierSection({ tier, users }: { tier: TierKey; users: HexUser[] }) {
  const config = TIER_CONFIG[tier];

  if (users.length === 0) return null;

  return (
    <div className="mt-3">
      <div className={`text-[12px] ${config.color}`}>
        {config.label} <span className="text-[#666]">({users.length})</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {users.map((user) => (
          <UserChip key={user.discord_id} user={user} />
        ))}
      </div>
    </div>
  );
}
