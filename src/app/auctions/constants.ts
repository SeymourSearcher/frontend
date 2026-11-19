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
