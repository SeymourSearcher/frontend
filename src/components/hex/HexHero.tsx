"use client";

import type { ReactNode } from "react";
import { HexSearchInput } from "@/components/HexSearchInput";

/** The searched colour itself. Describes the query, so it can restate no match. */
export function HexHero({ hexcode, children }: { hexcode: string; children?: ReactNode }) {
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
      </div>
    </div>
  );
}
