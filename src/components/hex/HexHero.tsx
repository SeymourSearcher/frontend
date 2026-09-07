"use client";

import type { ReactNode } from "react";
import type { HexMatch } from "@/types/hex";
import { HexSearchInput } from "@/components/HexSearchInput";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { formatPrice } from "@/lib/format";
import { TIER_CONFIG, tierForDeltaE } from "./tierConfig";

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

function Distances({ match, exact }: { match: HexMatch; exact: boolean }) {
  const tier = tierForDeltaE(match.delta_e);

  return (
    <p className="text-[12px] text-[#ccc] flex items-center gap-3">
      <span>
        ΔE{" "}
        <span className={`font-bold ${tier ? TIER_CONFIG[tier].color : "text-[#f0f0f0]"}`}>
          {match.delta_e}
        </span>
      </span>
      <span className="text-[#444]">|</span>
      <span>
        ABS <span className="text-[#f0f0f0] font-bold">{match.abs_diff}</span>
      </span>
      {!exact && <span className="text-[#666]">vs {match.target_name}</span>}
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
        <div className="min-h-[52px] flex flex-col justify-center gap-0.5">
          {exact && <ExactBanner match={exact} />}
          {reference && <Distances match={reference} exact={Boolean(exact)} />}
          {reference && <Estimate match={reference} />}
        </div>
      </div>
    </div>
  );
}
