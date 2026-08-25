import { SortBy } from "@/types/marketplace";

export const BUY_SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "price", label: "Price" },
  { value: "expires_at", label: "Expires" },
];

// Sell orders carry a match, so they can also sort by how close it is.
export const SELL_SORT_OPTIONS: { value: SortBy; label: string }[] = [
  ...BUY_SORT_OPTIONS,
  { value: "delta_e", label: "Delta E" },
];
