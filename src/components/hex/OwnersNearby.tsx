"use client";

import { useState } from "react";
import { fetchHexOwners } from "@/lib/api";
import type { HexOwnerMatch, HexOwnersPage } from "@/types/hex";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { Avatar } from "@/components/Avatar";

const PAGE_SIZE = 5;

// The block is reserved at its full height -- five rows plus the pager -- so
// loading, a short last page and an empty result all leave the page unmoved.
const ROW_CLASS = "flex items-center gap-3 bg-[#252525] rounded px-3 h-10";
const LIST_CLASS = "space-y-2 min-h-[232px]";
const PAGER_CLASS = "flex items-center justify-end gap-2 h-10";

function OwnerRow({ match }: { match: HexOwnerMatch }) {
  return (
    <li className={ROW_CLASS}>
      <Avatar user={match} alt="" />
      <span className="text-[12px] text-[#ccc] truncate">{match.username}</span>
      <span className="text-[11px] text-[#888]">{PIECE_SLOT_NAMES[match.piece]}</span>
      <ColorSwatch hex={match.hex_color} size="sm" />
      <span className="text-[11px] text-[#888]">#{match.hex_color}</span>
      <span className="ml-auto text-[11px] text-[#aaa]">ΔE {match.delta_e}</span>
      {match.quantity > 1 && (
        <span className="text-[10px] text-[#666]">×{match.quantity}</span>
      )}
    </li>
  );
}

function FillerRows({ count, pulse = false }: { count: number; pulse?: boolean }) {
  return Array.from({ length: count }, (_, i) => (
    <li key={i} className={`${ROW_CLASS} ${pulse ? "animate-pulse" : "invisible"}`} aria-hidden />
  ));
}

function Shell({
  count,
  children,
}: {
  count: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[#888] text-[12px]">Owners near this colour</h2>
        <span className="text-[#666] text-[11px]">{count}</span>
      </div>
      {children}
    </section>
  );
}

export function OwnersNearby({ hexcode }: { hexcode: string }) {
  const [page, setPage] = useState(0);

  const { state } = useAsyncData<HexOwnersPage>(
    () => fetchHexOwners(hexcode, PAGE_SIZE, page * PAGE_SIZE),
    [hexcode, page]
  );

  if (state.status === "loading") {
    return (
      <Shell count="">
        <ul className={LIST_CLASS}>
          <FillerRows count={PAGE_SIZE} pulse />
        </ul>
        <div className={PAGER_CLASS} />
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell count="">
        <div className={LIST_CLASS}>
          <StatusMessage tone="error">{state.detail}</StatusMessage>
        </div>
        <div className={PAGER_CLASS} />
      </Shell>
    );
  }

  const { total, max_delta_e, items } = state.data;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const button =
    "text-[11px] text-[#ccc] bg-[#252525] rounded px-2 py-1 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <Shell count={`${total} within ΔE ${max_delta_e.toFixed(1)}`}>
      <ul className={LIST_CLASS}>
        {items.map((match) => (
          <OwnerRow
            key={`${match.discord_id}-${match.piece}-${match.hex_color}`}
            match={match}
          />
        ))}
        <FillerRows count={PAGE_SIZE - items.length} />
      </ul>

      <div className={PAGER_CLASS}>
        {total === 0 ? (
          <span className="text-[#666] text-[11px] mr-auto">
            Nobody owns a colour this close yet
          </span>
        ) : (
          total > PAGE_SIZE && (
            <>
              <button className={button} disabled={page === 0} onClick={() => setPage(page - 1)}>
                ‹
              </button>
              <span className="text-[11px] text-[#666]">
                {page + 1} / {pageCount}
              </span>
              <button
                className={button}
                disabled={page >= pageCount - 1}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </>
          )
        )}
      </div>
    </Shell>
  );
}
