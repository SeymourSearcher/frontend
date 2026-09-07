import { TIER_CONFIG, TierKey } from "./tierConfig";

export function TierBadge({ tier, count }: { tier: TierKey; count: number }) {
  const config = TIER_CONFIG[tier];
  if (count === 0) return null;
  return (
    <span className={`${config.color} text-[10px] bg-[#252525] px-2 py-1 rounded`}>
      {tier.toUpperCase()}: {count}
    </span>
  );
}
