"use client";

import { fetchHexSales } from "@/lib/api";
import type { HexStatsTier } from "@/types/hex";
import type { PieceIndex } from "@/lib/pieces";
import { SalesList } from "@/components/auctions/SalesList";

interface RecentSalesProps {
  hexcode: string;
  includeDyes: boolean;
  pieces: PieceIndex[];
  /** The band the stats above are showing; undefined follows the searched colour. */
  tier: HexStatsTier | undefined;
}

/** The sales the stats above were computed from, newest first. */
export function RecentSales({ hexcode, includeDyes, pieces, tier }: RecentSalesProps) {
  const pieceKey = pieces.join(",");

  return (
    <SalesList
      heading="Similar auctions ended"
      emptyMessage="No sales in this band yet"
      fetchPage={(limit, offset) =>
        fetchHexSales(hexcode, includeDyes, pieces, tier, limit, offset)
      }
      deps={[hexcode, includeDyes, pieceKey, tier]}
      // ΔE to the searched colour, not the row's own delta_e — see HexSale.
      deltaE={(sale) => sale.search_delta_e}
    />
  );
}
