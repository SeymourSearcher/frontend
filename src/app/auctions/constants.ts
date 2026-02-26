export const PIECE_NAMES = ["Helmet", "Chestplate", "Leggings", "Boots"];

export const TIER_OPTIONS = [
  { value: "", label: "All Tiers" },
  { value: "t1", label: "T1" },
  { value: "t2", label: "T2" },
  { value: "t3", label: "T3" },
];

export const TIER_COLORS: Record<string, string> = {
  t1: "#22c55e",
  t2: "#eab308",
  t3: "#ef4444",
};

export const BIN_OPTIONS = [
  { value: "all", label: "All" },
  { value: "bin", label: "BIN" },
  { value: "nobin", label: "No BIN" },
];

export const ACTIVE_SORT_OPTIONS = [
  { value: "timeleft", label: "Time Left" },
  { value: "price", label: "Price" },
];

export const ENDED_SORT_OPTIONS = [
  { value: "timestamp", label: "Date Sold" },
  { value: "price", label: "Price" },
];

export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(1)}K`;
  return String(price);
}

export function formatTimeRemaining(endTime: number | null): string {
  if (!endTime) return "N/A";
  const now = Date.now();
  const diff = endTime - now;
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
