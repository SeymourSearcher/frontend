"use client";

import { fetchPatternSales } from "@/lib/api";
import type { HexStatsTier } from "@/types/hex";
import type { PieceIndex } from "@/lib/pieces";
import { SalesList } from "@/components/auctions/SalesList";

interface PatternSalesProps {
  pattern: string;
  includeDyes: boolean;
  tier: HexStatsTier;
  pieces: PieceIndex[];
}

/** The sales the stats above were computed from, newest first. */
export function PatternSales({ pattern, includeDyes, tier, pieces }: PatternSalesProps) {
  const pieceKey = pieces.join(",");

  return (
    <SalesList
      heading={`Auctions ended matching ${pattern}`}
      emptyMessage="No sales matching this pattern yet"
      fetchPage={(limit, offset) =>
        fetchPatternSales(pattern, includeDyes, pieces, tier, limit, offset)
      }
      deps={[pattern, includeDyes, pieceKey, tier]}
      // The row's own distance to its own catalog target: a pattern names a set
      // of colours, so there is no single origin to measure from.
      deltaE={(sale) => sale.delta_e}
    />
  );
}
