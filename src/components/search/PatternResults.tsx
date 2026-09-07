"use client";

import { useState } from "react";

import { fetchHexSearch } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { PatternFilters } from "@/components/search/PatternFilters";
import { PatternLegend } from "@/components/search/PatternLegend";
import { PatternResultCard } from "@/components/search/PatternResultCard";
import type { PieceIndex } from "@/lib/pieces";
import type { HexStatsTier } from "@/types/hex";
import type { HexSearchPage } from "@/types/hexSearch";

const PAGE_SIZE = 10;
// Mirrors MAX_OFFSET in backend/app/services/hex_search.py.
const MAX_OFFSET = 10_000;

interface Filters {
  includeDyes: boolean;
  ownedOnly: boolean;
  tier: HexStatsTier;
  pieces: PieceIndex[];
}

const DEFAULTS: Filters = { includeDyes: false, ownedOnly: false, tier: "all", pieces: [] };

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3";

function Skeleton() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }, (_, i) => (
        <div key={i} className="h-[150px] bg-[#1a1a1a] rounded-lg animate-pulse" />
      ))}
    </>
  );
}

export function PatternResults({ pattern }: { pattern: string }) {
  const [filters, setFilters] = useState(DEFAULTS);
  const [offset, setOffset] = useState(0);
  const { includeDyes, ownedOnly, tier, pieces } = filters;
  const pieceKey = pieces.join(",");

  /** Narrowing the result set invalidates the offset, so the two move together. */
  function patch(change: Partial<Filters>) {
    setFilters({ ...filters, ...change });
    setOffset(0);
  }

  const { state } = useAsyncData<HexSearchPage>(
    () =>
      fetchHexSearch(pattern, {
        includeDyes,
        ownedOnly,
        tier: tier === "all" ? undefined : tier,
        pieces,
        limit: PAGE_SIZE,
        offset,
      }),
    [pattern, includeDyes, ownedOnly, tier, pieceKey, offset]
  );

  const page = state.status === "success" ? state.data : null;
  // Deep paging is capped server-side, so the pager stops before the total does.
  const pageable = page ? Math.min(page.total, MAX_OFFSET + PAGE_SIZE) : 0;

  return (
    <>
      <PatternLegend pattern={pattern} />

      <PatternFilters
        includeDyes={includeDyes}
        onIncludeDyesChange={(includeDyes) => patch({ includeDyes })}
        ownedOnly={ownedOnly}
        onOwnedOnlyChange={(ownedOnly) => patch({ ownedOnly })}
        tier={tier}
        onTierChange={(tier) => patch({ tier })}
        pieces={pieces}
        onPiecesChange={(pieces) => patch({ pieces })}
      />

      {page && (
        <p className="text-[11px] text-[#888] mb-3">
          {page.total.toLocaleString()} colour{page.total === 1 ? "" : "s"}
          {page.total !== page.pattern_total &&
            ` of ${page.pattern_total.toLocaleString()} matching ${pattern}`}
          {page.items.length > 0 && ` · showing ${offset + 1}–${offset + page.items.length}`}
        </p>
      )}

      {/* The floor keeps the pager from jumping up on a short or empty page. */}
      <div className="min-h-[340px]">
        {state.status === "error" ? (
          <StatusMessage tone="error">{state.detail}</StatusMessage>
        ) : state.status === "success" && state.data.items.length === 0 ? (
          <StatusMessage>No colours match these filters</StatusMessage>
        ) : (
          <div className={GRID}>
            {state.status === "loading" ? (
              <Skeleton />
            ) : (
              state.data.items.map((result) => (
                <PatternResultCard key={result.hex_code} result={result} />
              ))
            )}
          </div>
        )}
      </div>

      {pageable > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0}
            className="text-[12px] text-[#888] px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            Previous
          </button>
          <span className="text-[11px] text-[#666]">
            {Math.floor(offset / PAGE_SIZE) + 1} / {Math.ceil(pageable / PAGE_SIZE)}
          </span>
          <button
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={offset + PAGE_SIZE >= pageable}
            className="text-[12px] text-[#888] px-3 py-1.5 rounded bg-[#2a2a2a] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
