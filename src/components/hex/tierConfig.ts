export const TIER_CONFIG = {
  t1: { color: "text-green-400", label: "Tier 1 (ΔE 0-2)" },
  t2: { color: "text-yellow-400", label: "Tier 2 (ΔE 2-5)" },
  t3: { color: "text-orange-400", label: "Tier 3 (ΔE 5-10)" },
} as const;

export type TierKey = keyof typeof TIER_CONFIG;
