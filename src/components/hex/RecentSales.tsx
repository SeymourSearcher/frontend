"use client";

import { useEffect, useState } from "react";
import { fetchHexSales } from "@/lib/api";
import type { HexSale, HexSalesPage, HexStatsTier } from "@/types/hex";
import type { PieceIndex } from "@/lib/pieces";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { formatPrice, formatTimestamp } from "@/lib/format";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { MinecraftItem } from "@/components/ui/MinecraftItem";
import { TIER_CONFIG, tierForDeltaE } from "./tierConfig";

const PAGE_SIZE = 8;

const ROW_CLASS = "flex items-center gap-3 px-3 h-12 rounded bg-[#1a1a1a] border border-[#2a2a2a]";

// Always present, even on a short last page, so the block below it doesn't jump.
const PAGER_CLASS = "flex items-center justify-end gap-2 h-10";
const PAGER_BUTTON =
  "text-[11px] text-[#ccc] bg-[#252525] rounded px-2 py-1 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function SaleRow({ sale }: { sale: HexSale }) {
  const tier = tierForDeltaE(sale.search_delta_e);

  return (
    <li className={ROW_CLASS} title={`${PIECE_SLOT_NAMES[sale.piece]} · #${sale.hex_color}`}>
      <MinecraftItem piece={sale.piece} hex={sale.hex_color} scale={2} />

      <span className="text-[11px] font-bold w-[70px]" style={{ color: `#${sale.hex_color}` }}>
        #{sale.hex_color}
      </span>

      <span className="text-[11px] text-green-400 font-bold w-[60px]">
        {formatPrice(sale.price)}
      </span>

      {/* ΔE to the searched colour, not the row's own delta_e — see HexSale. */}
      <span className={`text-[10px] ${tier ? TIER_CONFIG[tier].color : "text-[#888]"}`}>
        ΔE {sale.search_delta_e}
      </span>

      {sale.is_bin && <span className="text-[9px] text-[#5865F2] font-bold">BIN</span>}

      <span className="text-[10px] text-[#666] ml-auto shrink-0">
        {formatTimestamp(sale.timestamp)}
      </span>
    </li>
  );
}

function Skeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }, (_, i) => (
        <li key={i} className={`${ROW_CLASS} animate-pulse`} aria-hidden />
      ))}
    </>
  );
}

interface RecentSalesProps {
  hexcode: string;
  includeDyes: boolean;
  pieces: PieceIndex[];
  /** The band the stats above are showing; undefined follows the searched colour. */
  tier: HexStatsTier | undefined;
}

/** The sales the stats above were computed from, newest first. */
export function RecentSales({ hexcode, includeDyes, pieces, tier }: RecentSalesProps) {
  const [page, setPage] = useState(0);
  const pieceKey = pieces.join(",");

  // Any of these reshapes the list, so a held offset could land past its end.
  useEffect(() => setPage(0), [hexcode, includeDyes, pieceKey, tier]);

  const { state } = useAsyncData<HexSalesPage>(
    () => fetchHexSales(hexcode, includeDyes, pieces, tier, PAGE_SIZE, page * PAGE_SIZE),
    [hexcode, includeDyes, pieceKey, tier, page]
  );

  const shown = state.status === "success" ? state.data.items.length : 0;
  const total = state.status === "success" ? state.data.total : 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const first = page * PAGE_SIZE;

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h3 className="text-[#888] text-[11px]">Similar auctions ended</h3>
        {shown > 0 && (
          <span className="text-[#666] text-[10px]">
            {first + 1}–{first + shown} of {total}
          </span>
        )}
      </div>

      {state.status === "error" ? (
        <StatusMessage tone="error">{state.detail}</StatusMessage>
      ) : state.status === "success" && state.data.items.length === 0 ? (
        <StatusMessage>No sales in this band yet</StatusMessage>
      ) : (
        <>
          {/* A full page's height, so a short last page doesn't slide the pager
              up from under the cursor: 8 rows of h-12 plus seven gap-1.5. */}
          <ul className="flex flex-col gap-1.5 min-h-[426px]">
            {state.status === "loading" ? (
              <Skeleton />
            ) : (
              state.data.items.map((sale) => <SaleRow key={sale.auction_id} sale={sale} />)
            )}
          </ul>

          <div className={PAGER_CLASS}>
            {total > PAGE_SIZE && (
              <>
                <button
                  className={PAGER_BUTTON}
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  ‹
                </button>
                <span className="text-[11px] text-[#666]">
                  {page + 1} / {pageCount}
                </span>
                <button
                  className={PAGER_BUTTON}
                  disabled={page >= pageCount - 1}
                  onClick={() => setPage(page + 1)}
                >
                  ›
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
