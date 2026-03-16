"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchHexInfo, HexInfo } from "@/lib/api";
import { HexSearchInput } from "@/components/HexSearchInput";
import { ClosestMatchSidebar, MatchCard } from "@/components/hex";

export default function HexPage() {
  const params = useParams();
  const hexcode = (params.hexcode as string)?.toUpperCase() || "";
  
  const [hexInfo, setHexInfo] = useState<HexInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [includeDyes, setIncludeDyes] = useState(false);

  useEffect(() => {
    if (!hexcode || !/^[0-9A-F]{6}$/.test(hexcode)) {
      setLoading(false);
      setError("Invalid hex code");
      return;
    }

    setLoading(true);
    setError("");
    fetchHexInfo(hexcode, includeDyes).then((data) => {
      if (data) {
        setHexInfo(data);
      } else {
        setError("Failed to fetch hex info");
      }
      setLoading(false);
    });
  }, [hexcode, includeDyes]);

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-6 sm:p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h1 className="text-[1.25em] sm:text-[1.5em] text-[#f0f0f0] mb-4 text-center">Hex Search</h1>
      
      <div className="mb-6">
        <HexSearchInput
          initialValue={hexcode}
          showPreview
          colorizeInput
          placeholder="FFFF00"
          inputClassName="bg-[#222] border border-[#444] rounded px-3 py-2 text-[14px] w-[120px] uppercase font-bold"
          buttonClassName="bg-[#5865F2] text-white px-4 py-2 rounded text-[12px] border-none cursor-pointer hover:bg-[#4752C4] transition-colors"
        >
          <label className="flex items-center gap-2 text-[12px] text-[#888] cursor-pointer">
            <input
              type="checkbox"
              checked={includeDyes}
              onChange={(e) => setIncludeDyes(e.target.checked)}
              className="w-4 h-4 accent-[#5865F2]"
            />
            Include Dyes
          </label>
        </HexSearchInput>
      </div>

      {loading ? (
        <p className="text-[#888] text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : hexInfo && hexInfo.top_matches.length > 0 ? (
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="w-full lg:w-[280px] lg:shrink-0">
              <ClosestMatchSidebar match={hexInfo.top_matches[0]} searchHex={hexInfo.hex_code} />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-[#888] text-[12px] mb-4">
                Top 3 Closest Matches
              </h2>
              <div className="space-y-4">
                {hexInfo.top_matches.map((match, idx) => (
                  <MatchCard key={match.target_hex} match={match} rank={idx + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : hexInfo ? (
        <p className="text-[#888] text-center">No matches found</p>
      ) : null}
    </main>
  );
}
