"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { fetchHexInfo } from "@/lib/api";
import type { HexInfo } from "@/types/hex";
import { isValidHex } from "@/lib/hex";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { HexHero } from "@/components/hex/HexHero";
import { OwnersNearby } from "@/components/hex/OwnersNearby";
import { CATALOG_ROW_HEIGHT, CatalogMatchRow } from "@/components/hex/CatalogMatchRow";

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

export default function HexPage() {
  const params = useParams();
  const hexcode = (params.hexcode as string)?.toUpperCase() || "";
  const valid = isValidHex(hexcode);

  const [includeDyes, setIncludeDyes] = useState(false);

  const { state } = useAsyncData<HexInfo>(
    () =>
      valid
        ? fetchHexInfo(hexcode, includeDyes)
        : Promise.resolve({ ok: false, status: 400, detail: "Invalid hex code" }),
    [hexcode, includeDyes]
  );

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-6 sm:p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <div className="max-w-[900px] mx-auto">
        <HexHero hexcode={valid ? hexcode : "333333"}>
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

        {/* Keyed so navigating to another hex drops the page offset with it. */}
        {valid && <OwnersNearby key={hexcode} hexcode={hexcode} />}

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
      </div>
    </main>
  );
}
