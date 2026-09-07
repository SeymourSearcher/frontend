"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Seymour } from "@/types/seymour";
import { PieceIndex } from "@/lib/pieces";
import SeymourCard from "./SeymourCard";

const PREVIEW_HEXES = [
  "8b3a2f", "c9a227", "2f6f4e", "3b5ba9", "7a4b8c", "b4553d",
  "4f8fa8", "9c6b3e", "5d7a2c", "a83f5b", "36607d", "d1a05c",
  "6e3f7a", "2c8b6a", "b07c2a", "45538f", "8f2f4d", "5a8c3b",
  "c26a3f", "3a7f8b", "7d5a9c", "9b4030", "417a55", "6f6f2e",
];

const PREVIEW_SETS = ["Crimson Set", "Emerald Set", "Sapphire Set", "Amber Set"];

/** Plausible-looking cards so the blurred preview reads as real inventory, not empty boxes. */
const PREVIEW_SEYMOURS: Seymour[] = PREVIEW_HEXES.map((hex, i) => ({
  id: -(i + 1),
  item_name: (i % 4) as PieceIndex,
  hex_color: hex,
  match: {
    target_name: PREVIEW_SETS[i % PREVIEW_SETS.length],
    target_hex: hex,
    delta_e: Number((1.2 + (i % 7) * 0.83).toFixed(2)),
  },
}));

const PREVIEW_FILTERS = ["All", "Stars", "T1", "T2", "T3", "Words", "Dupes", "Sets", "Dyes", "Custom"];

export default function LoggedOutPreview() {
  const { login } = useAuth();

  return (
    <div className="relative">
      <div aria-hidden className="blur-[6px] opacity-50 pointer-events-none select-none">
        <p className="text-[#888] text-center mb-4 text-[12px]">Total: 248</p>

        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
          {PREVIEW_FILTERS.map((label, i) => (
            <span
              key={label}
              className={`px-3 py-1 rounded text-[12px] ${
                i === 0 ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc]"
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 max-w-[1200px] mx-auto">
          {PREVIEW_SEYMOURS.map((s) => (
            <SeymourCard key={s.id} seymour={s} />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-start justify-center pt-24 bg-gradient-to-b from-[#121212]/40 to-[#121212]">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 text-center max-w-sm">
          <h2 className="text-[#f0f0f0] text-[16px] mb-2">Log in to see your Seymours</h2>
          <p className="text-[#888] text-[12px] mb-4">
            Connect with Discord and upload an export to browse, filter and sell your collection.
          </p>
          <button
            onClick={login}
            className="px-4 py-2 rounded text-[12px] bg-[#5865F2] text-white border-none cursor-pointer hover:bg-[#4752c4] transition-colors"
          >
            Login with Discord
          </button>
        </div>
      </div>
    </div>
  );
}
