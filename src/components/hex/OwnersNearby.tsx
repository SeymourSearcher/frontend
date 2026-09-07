"use client";

import { useEffect, useState } from "react";
import { fetchHexOwners } from "@/lib/api";
import type { HexOwnerMatch, HexOwnersPage } from "@/types/hex";
import { PIECE_SLOT_NAMES, type PieceIndex } from "@/lib/pieces";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { MinecraftItem } from "@/components/ui/MinecraftItem";
import { Avatar } from "@/components/Avatar";

const PAGE_SIZE = 5;

// The grid is five fixed slots and the pager is always present, so loading, a
// short last page and an empty result all leave the page unmoved.
const GRID_CLASS = "grid grid-cols-5 gap-2 min-h-[136px]";
const TILE_CLASS = "flex flex-col items-center gap-1 py-2";
const PAGER_CLASS = "flex items-center justify-end gap-2 h-10";

function OwnerTile({ match }: { match: HexOwnerMatch }) {
  return (
    <li className={TILE_CLASS}>
      <MinecraftItem piece={match.piece} hex={match.hex_color} scale={3} />
      <Avatar user={match} size="sm" alt="" />
      <span className="text-[11px] text-[#ccc] truncate max-w-full">{match.username}</span>
      <span className="text-[10px] text-[#666]">{PIECE_SLOT_NAMES[match.piece]}</span>
      <span className="text-[10px] text-[#aaa]">
        ΔE {match.delta_e}
        {match.quantity > 1 && <span className="text-[#666]"> ×{match.quantity}</span>}
      </span>
    </li>
  );
}

function FillerTiles({ count, pulse = false }: { count: number; pulse?: boolean }) {
  return Array.from({ length: count }, (_, i) => (
    <li key={i} className={TILE_CLASS} aria-hidden>
      <div className={`w-12 h-12 rounded bg-[#1e1e1e] ${pulse ? "animate-pulse" : "invisible"}`} />
    </li>
  ));
}

function Shell({ count, children }: { count: string; children: React.ReactNode }) {
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

export function OwnersNearby({ hexcode, pieces }: { hexcode: string; pieces: PieceIndex[] }) {
  const [page, setPage] = useState(0);
  const pieceKey = pieces.join(",");

  // Narrowing the slots shortens the list, so a held offset could land past its end.
  useEffect(() => setPage(0), [pieceKey]);

  const { state } = useAsyncData<HexOwnersPage>(
    () => fetchHexOwners(hexcode, PAGE_SIZE, page * PAGE_SIZE, pieces),
    [hexcode, page, pieceKey]
  );

  if (state.status === "loading") {
    return (
      <Shell count="">
        <ul className={GRID_CLASS}>
          <FillerTiles count={PAGE_SIZE} pulse />
        </ul>
        <div className={PAGER_CLASS} />
      </Shell>
    );
  }

  if (state.status === "error") {
    return (
      <Shell count="">
        <div className={GRID_CLASS}>
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
      <ul className={GRID_CLASS}>
        {items.map((match) => (
          <OwnerTile
            key={`${match.discord_id}-${match.piece}-${match.hex_color}`}
            match={match}
          />
        ))}
        <FillerTiles count={PAGE_SIZE - items.length} />
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
