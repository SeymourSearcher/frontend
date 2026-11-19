import { formatPrice } from "@/lib/format";
import type { CategoryValues, CollectionValue, FilterType } from "@/types/seymour";

/** Chips whose key is also a category in the valuation payload. Custom is absent
 *  by design — see backend/app/services/collection_value.py. */
export function chipValue(key: FilterType, value: CollectionValue | null): string {
  if (!value || key === "all" || key === "custom") return "";
  const amount = value.categories[key as keyof CategoryValues];
  return amount ? formatPrice(amount) : "";
}

/** `total` is null until /stats/me lands. The paragraph still renders, empty:
 *  mounting it on arrival pushed the chips, the dropdown and the grid down. */
export function CollectionSummary({
  total,
  value,
}: {
  total: number | null;
  value: CollectionValue | null;
}) {
  return (
    <p
      className="text-[#888] text-center mb-4 text-[12px] min-h-[18px]"
      // Always present, not only when something is unpriced: the overlap is the
      // part a reader would otherwise assume away by adding the chips up.
      title="Estimated from median sale prices of each colour's nearest catalog match, at its own tier. Per-chip figures overlap — one item can be a Star and T1 and part of a set — so they do not sum to the total."
    >
      {total !== null && `Total: ${total}`}
      {value && value.priced > 0 && (
        <>
          {" · est. "}
          <span className="text-green-400">{formatPrice(value.total)}</span>
          {value.unpriced > 0 && (
            <span className="text-[#666]">
              {" "}
              from {value.priced} priced
            </span>
          )}
        </>
      )}
    </p>
  );
}
