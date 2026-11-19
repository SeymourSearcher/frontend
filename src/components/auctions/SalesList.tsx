"use client";

import type { DependencyList } from "react";

import type { ApiResult } from "@/lib/apiResult";
import type { EndedAuction } from "@/types/auction";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { formatPrice, formatTimestamp } from "@/lib/format";
import { useAsyncData } from "@/hooks/useAsyncData";
import { usePageResetOn } from "@/hooks/usePageResetOn";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { MinecraftItem } from "@/components/ui/MinecraftItem";
import { TIER_CONFIG, tierForDeltaE } from "@/components/hex/tierConfig";
import { SALES_PAGE_SIZE } from "@/lib/api";

const ROW_CLASS = "flex items-center gap-3 px-3 h-12 rounded bg-[#1a1a1a] border border-[#2a2a2a]";

// Always present, even on a short last page, so the block below it doesn't jump.
const PAGER_CLASS = "flex items-center justify-end gap-2 h-10";
const PAGER_BUTTON =
  "text-[11px] text-[#ccc] bg-[#252525] rounded px-2 py-1 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function SaleRow({ sale, deltaE }: { sale: EndedAuction; deltaE: number }) {
  const tier = tierForDeltaE(deltaE);

  return (
    <li className={ROW_CLASS} title={`${PIECE_SLOT_NAMES[sale.piece]} · #${sale.hex_color}`}>
      <MinecraftItem piece={sale.piece} hex={sale.hex_color} scale={2} />

      <span className="text-[11px] font-bold w-[70px]" style={{ color: `#${sale.hex_color}` }}>
        #{sale.hex_color}
      </span>

      <span className="text-[11px] text-green-400 font-bold w-[60px]">
        {formatPrice(sale.price)}
      </span>

      <span className={`text-[10px] ${tier ? TIER_CONFIG[tier].color : "text-[#888]"}`}>
        ΔE {deltaE}
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
      {Array.from({ length: SALES_PAGE_SIZE }, (_, i) => (
        <li key={i} className={`${ROW_CLASS} animate-pulse`} aria-hidden />
      ))}
    </>
  );
}

interface SalesListProps<T extends EndedAuction> {
  heading: string;
  emptyMessage: string;
  fetchPage: (limit: number, offset: number) => Promise<ApiResult<{ total: number; items: T[] }>>;
  /** Server-rendered first page for the initial deps. */
  initialPage?: { total: number; items: T[] };
  /** What reshapes the list. Any change refetches and returns to the first page. */
  deps: DependencyList;
  /** Which distance a row shows — the callers measure from different origins. */
  deltaE: (sale: T) => number;
}

/** A paged ended-auction log, newest first. */
export function SalesList<T extends EndedAuction>({
  heading,
  emptyMessage,
  fetchPage,
  deps,
  deltaE,
  initialPage,
}: SalesListProps<T>) {
  // A held offset could otherwise land past the end of the reshaped list.
  const [page, setPage] = usePageResetOn(JSON.stringify(deps));

  const { state } = useAsyncData(
    () => fetchPage(SALES_PAGE_SIZE, page * SALES_PAGE_SIZE),
    [...deps, page],
    true,
    initialPage
  );

  const shown = state.status === "success" ? state.data.items.length : 0;
  const total = state.status === "success" ? state.data.total : 0;
  const pageCount = Math.max(1, Math.ceil(total / SALES_PAGE_SIZE));
  const first = page * SALES_PAGE_SIZE;

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <h3 className="text-[#888] text-[11px]">{heading}</h3>
        {shown > 0 && (
          <span className="text-[#666] text-[10px]">
            {first + 1}–{first + shown} of {total}
          </span>
        )}
      </div>

      {state.status === "error" ? (
        <StatusMessage tone="error">{state.detail}</StatusMessage>
      ) : state.status === "success" && state.data.items.length === 0 ? (
        <StatusMessage>{emptyMessage}</StatusMessage>
      ) : (
        <>
          {/* A full page's height, so a short last page doesn't slide the pager
              up from under the cursor: 8 rows of h-12 plus seven gap-1.5. */}
          <ul className="flex flex-col gap-1.5 min-h-[426px]">
            {state.status === "loading" ? (
              <Skeleton />
            ) : (
              state.data.items.map((sale) => (
                <SaleRow key={sale.auction_id} sale={sale} deltaE={deltaE(sale)} />
              ))
            )}
          </ul>

          <div className={PAGER_CLASS}>
            {total > SALES_PAGE_SIZE && (
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
