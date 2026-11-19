"use client";

import { useState } from "react";
import { fetchHexInfo } from "@/lib/api";
import type { HexInfo } from "@/types/hex";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { HexHero } from "@/components/hex/HexHero";
import { OwnersNearby } from "@/components/hex/OwnersNearby";
import { CATALOG_ROW_HEIGHT, CatalogMatchRow } from "@/components/hex/CatalogMatchRow";
import { PieceFilter } from "@/components/hex/PieceFilter";
import { HexAuctionStats } from "@/components/hex/HexAuctionStats";
import type { PieceIndex } from "@/lib/pieces";

const CATALOG_COUNT = 3;

function CatalogSkeleton() {
  return (
    <>
      {Array.from({ length: CATALOG_COUNT }, (_, i) => (
        <div
          key={i}
          className={`bg-[#1a1a1a] border border-[#2c2c2c] rounded animate-pulse ${CATALOG_ROW_HEIGHT}`}
        />
      ))}
    </>
  );
}

interface HexPageClientProps {
  /** Already validated and uppercased by the server page. */
  hexcode: string;
  /** The unfiltered hex info, or null if the server could not fetch it. */
  initialInfo: HexInfo | null;
}

export function HexPageClient({ hexcode, initialInfo }: HexPageClientProps) {
  const [includeDyes, setIncludeDyes] = useState(false);
  const [pieces, setPieces] = useState<PieceIndex[]>([]);
  const pieceKey = pieces.join(",");

  const { state } = useAsyncData<HexInfo>(
    () => fetchHexInfo(hexcode, includeDyes, pieces),
    [hexcode, includeDyes, pieceKey],
    true,
    initialInfo ?? undefined
  );

  const info = state.status === "success" ? state.data : null;
  // The exact colour is what to price when there is one; otherwise the nearest.
  const reference = info?.exact_match ?? info?.top_matches[0] ?? null;

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-6 sm:p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <div className="max-w-[900px] mx-auto">
        <HexHero hexcode={hexcode} reference={reference} exact={info?.exact_match ?? null}>
          <label className="flex items-center gap-2 text-[12px] text-[#888] cursor-pointer">
            <input
              type="checkbox"
              checked={includeDyes}
              onChange={(e) => setIncludeDyes(e.target.checked)}
              className="w-4 h-4 accent-[#5865F2]"
            />
            Include Dyes
          </label>
        </HexHero>

        <PieceFilter selected={pieces} onChange={setPieces} />

        <OwnersNearby hexcode={hexcode} pieces={pieces} />

        <h2 className="text-[#888] text-[12px] mb-3">Closest catalog items</h2>
        <div className="space-y-2">
          {state.status === "loading" ? (
            <CatalogSkeleton />
          ) : state.status === "error" ? (
            <StatusMessage tone="error">{state.detail}</StatusMessage>
          ) : state.data.top_matches.length > 0 ? (
            state.data.top_matches.map((match, idx) => (
              <CatalogMatchRow key={match.target_hex} match={match} rank={idx + 1} />
            ))
          ) : (
            <StatusMessage>No matches found</StatusMessage>
          )}
        </div>

        <HexAuctionStats hexcode={hexcode} includeDyes={includeDyes} pieces={pieces} />
      </div>
    </main>
  );
}
