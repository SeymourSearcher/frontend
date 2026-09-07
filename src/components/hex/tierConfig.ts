export const TIER_CONFIG = {
  t1: { color: "text-green-400", label: "Tier 1 (ΔE 0-2)", max: 2 },
  t2: { color: "text-yellow-400", label: "Tier 2 (ΔE 2-5)", max: 5 },
  t3: { color: "text-orange-400", label: "Tier 3 (ΔE 5-10)", max: 10 },
} as const;

export type TierKey = keyof typeof TIER_CONFIG;

export const TIER_KEYS: TierKey[] = ["t1", "t2", "t3"];

/** Null past the last tier — mirrors get_tier in backend/app/services/matching.py. */
export function tierForDeltaE(deltaE: number): TierKey | null {
  return TIER_KEYS.find((tier) => deltaE < TIER_CONFIG[tier].max) ?? null;
}
