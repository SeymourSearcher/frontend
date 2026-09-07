import type { HexUser } from "@/types/hex";
import { UserChip } from "./UserChip";
import { TIER_CONFIG, TIER_KEYS, tierForDeltaE } from "./tierConfig";

/**
 * Every owner in one ΔE-ordered grid, the distance coloured by its tier.
 *
 * Three headed sections of free-wrapping chips restated counts the row's tier
 * badges already carry, and wrapped ragged at three different widths.
 */
export function TierGrid({ tiers }: { tiers: Record<string, HexUser[]> }) {
  const users = TIER_KEYS.flatMap((tier) => tiers[tier] ?? []).sort(
    (a, b) => a.delta_e - b.delta_e
  );

  if (users.length === 0) {
    return <p className="text-[#666] text-[11px] mt-3">No owners within ΔE 10</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
      {users.map((user) => {
        const tier = tierForDeltaE(user.delta_e);
        return (
          <UserChip
            key={user.discord_id}
            user={user}
            deltaClassName={tier ? TIER_CONFIG[tier].color : "text-[#666]"}
          />
        );
      })}
    </div>
  );
}
