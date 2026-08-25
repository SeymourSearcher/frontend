interface SortSelectProps<T extends string> {
  sortBy: T;
  sortOrder: "asc" | "desc";
  options: { value: T; label: string }[];
  onSortByChange: (value: T) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  size?: "default" | "compact";
  /** Which direction is listed first; the two call sites disagree. */
  orderFirst?: "asc" | "desc";
}

const SIZES = { default: "px-2 py-1.5", compact: "px-2 py-1" };

const ORDER_LABELS = { asc: "Low to High", desc: "High to Low" } as const;

export function SortSelect<T extends string>({
  sortBy,
  sortOrder,
  options,
  onSortByChange,
  onSortOrderChange,
  size = "default",
  orderFirst = "asc",
}: SortSelectProps<T>) {
  const selectClass = `bg-[#2a2a2a] text-[#ccc] text-[11px] ${SIZES[size]} rounded border border-[#444] cursor-pointer`;
  const orders: ("asc" | "desc")[] =
    orderFirst === "asc" ? ["asc", "desc"] : ["desc", "asc"];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[#888] text-[11px]">Sort:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as T)}
        className={selectClass}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
        className={selectClass}
      >
        {orders.map((order) => (
          <option key={order} value={order}>
            {ORDER_LABELS[order]}
          </option>
        ))}
      </select>
    </div>
  );
}
