"use client";

import { useSearchParams } from "next/navigation";

import { isValidPattern, sanitizePatternInput } from "@/lib/hex";
import { HexSearchInput } from "@/components/HexSearchInput";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { PatternResults } from "@/components/search/PatternResults";

export default function SearchPage() {
  const params = useSearchParams();
  const pattern = sanitizePatternInput(params.get("p") ?? "");

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-6 sm:p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-[#eee] text-[18px] mb-4">Pattern search</h1>

        <div className="mb-4">
          {/* Keyed so the box reseeds when the query string changes under it. */}
          <HexSearchInput source="search_page" key={pattern} initialValue={pattern} showPreview />
        </div>

        {isValidPattern(pattern) ? (
          // Keyed too: a new pattern drops the filters and the page offset with it.
          <PatternResults key={pattern} pattern={pattern} />
        ) : (
          <StatusMessage>
            Enter a six-slot pattern: digits and A–F are fixed, ? is any digit, and a
            repeated letter (X, Y, Z…) must hold the same digit each time. Try 21???? or
            X2XYZZ.
          </StatusMessage>
        )}
      </div>
    </main>
  );
}
