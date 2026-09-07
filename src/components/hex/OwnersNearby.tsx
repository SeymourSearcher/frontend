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

function OwnerRow({ match }: { match: HexOwnerMatch }) {
  return (
    <li className="flex items-center gap-3 bg-[#252525] rounded px-3 py-2">
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

function Pager({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  const button =
    "text-[11px] text-[#ccc] bg-[#252525] rounded px-2 py-1 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-end gap-2 mt-3">
      <button className={button} disabled={page === 0} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      <span className="text-[11px] text-[#666]">
        {page + 1} / {pageCount}
      </span>
      <button
        className={button}
        disabled={page >= pageCount - 1}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
}

export function OwnersNearby({ hexcode }: { hexcode: string }) {
  const [page, setPage] = useState(0);

  const { state } = useAsyncData<HexOwnersPage>(
    () => fetchHexOwners(hexcode, PAGE_SIZE, page * PAGE_SIZE),
    [hexcode, page]
  );

  if (state.status === "loading") return <StatusMessage>Loading owners...</StatusMessage>;
  if (state.status === "error") return <StatusMessage tone="error">{state.detail}</StatusMessage>;

  const { total, max_delta_e, items } = state.data;

  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[#888] text-[12px]">Owners within ΔE {max_delta_e.toFixed(1)}</h2>
        <span className="text-[#666] text-[11px]">
          {total} holding{total === 1 ? "" : "s"}
        </span>
      </div>

      {total === 0 ? (
        <p className="text-[#666] text-[11px]">Nobody owns a colour this close yet</p>
      ) : (
        <>
          <ul className="space-y-2">
            {items.map((match) => (
              <OwnerRow
                key={`${match.discord_id}-${match.piece}-${match.hex_color}`}
                match={match}
              />
            ))}
          </ul>
          {total > PAGE_SIZE && (
            <Pager
              page={page}
              pageCount={Math.ceil(total / PAGE_SIZE)}
              onChange={setPage}
            />
          )}
        </>
      )}
    </section>
  );
}
