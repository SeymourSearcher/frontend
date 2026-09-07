"use client";

import type { ReactNode } from "react";
import type { HexMatch } from "@/types/hex";
import { HexSearchInput } from "@/components/HexSearchInput";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { formatPrice } from "@/lib/format";
import { tierForDeltaE } from "./tierConfig";

function ExactBanner({ match }: { match: HexMatch }) {
  return (
    <p className="text-[12px] text-green-400">
      ✦ Exact: {match.target_name}
      <span className="text-[#666]">
        {" "}
        · {match.pieces.map((p) => PIECE_SLOT_NAMES[p]).join(", ")}
      </span>
    </p>
  );
}

function Estimate({ match }: { match: HexMatch }) {
  const tier = tierForDeltaE(match.delta_e);

  if (match.price.median === null) {
    return (
      <p className="text-[11px] text-[#666]">
        No comparable sales for {match.target_name}
      </p>
    );
  }

  return (
    <p className="text-[12px] text-[#ccc]">
      Est. <span className="text-[#f0f0f0] font-bold">{formatPrice(match.price.median)}</span>
      <span className="text-[#666]">
        {" "}
        · median of {match.price.sales} {tier ?? ""} {match.target_name} sale
        {match.price.sales === 1 ? "" : "s"}
      </span>
    </p>
  );
}

interface HexHeroProps {
  hexcode: string;
  /** The exact catalog match if there is one, else the nearest — what to price. */
  reference: HexMatch | null;
  exact: HexMatch | null;
  children?: ReactNode;
}

/** The searched colour itself. Describes the query, so it restates no match. */
export function HexHero({ hexcode, reference, exact, children }: HexHeroProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1a1a1a] border border-[#2c2c2c] rounded-lg p-4 mb-6">
      <div
        className="w-16 h-16 rounded-md border border-[#333] shrink-0"
        style={{ backgroundColor: `#${hexcode}` }}
      />
      <div className="flex flex-col items-center sm:items-start gap-2">
        <span className="text-[#f0f0f0] text-[18px] font-bold">#{hexcode}</span>
        <HexSearchInput
          // Remounts on navigation; initialValue only seeds the field once.
          key={hexcode}
          initialValue={hexcode}
          colorizeInput
          placeholder="FFFF00"
          inputClassName="bg-[#222] border border-[#444] rounded px-3 py-2 text-[14px] w-[120px] uppercase font-bold"
          buttonClassName="bg-[#5865F2] text-white px-4 py-2 rounded text-[12px] border-none cursor-pointer hover:bg-[#4752C4] transition-colors"
        >
          {children}
        </HexSearchInput>

        {/* Fixed height: these fill in after the fetch and must not shift the page. */}
        <div className="min-h-[34px] flex flex-col justify-center">
          {exact && <ExactBanner match={exact} />}
          {reference && <Estimate match={reference} />}
        </div>
      </div>
    </div>
  );
}
