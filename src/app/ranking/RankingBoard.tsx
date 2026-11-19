"use client";

import { useState } from "react";
import { fetchRankings } from "@/lib/api";
import type { RankingUser, Stats } from "@/types/stats";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Avatar } from "@/components/Avatar";
import { RankBadge } from "@/components/RankBadge";

// Keyed by the API's stat field: the sort is done by the backend, which ranks
// and caps the board, so these go over the wire as `sort_by`.
type SortKey = keyof Stats;

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "total_seymours", label: "Total" },
  { key: "t1", label: "T1" },
  { key: "t2", label: "T2" },
  { key: "t3", label: "T3" },
  { key: "words", label: "Words" },
  { key: "dupes", label: "Dupes" },
  { key: "total_sets", label: "Sets" },
  { key: "dyed_sets", label: "Dyed" },
];

const DEFAULT_SORT: SortKey = "total_seymours";

/** `initialRankings` is the server-rendered board for DEFAULT_SORT, or null if that fetch failed. */
export function RankingBoard({ initialRankings }: { initialRankings: RankingUser[] | null }) {
  const [sortBy, setSortBy] = useState<SortKey>(DEFAULT_SORT);
  const { state } = useAsyncData(
    () => fetchRankings(sortBy),
    [sortBy],
    true,
    initialRankings ?? undefined
  );

  const ranked = state.status === "success" ? state.data : [];

  return (
    <main className="min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-6 text-center">Rankings</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`px-3 py-1 rounded text-[12px] border-none cursor-pointer transition-colors ${
              sortBy === opt.key ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {state.status === "loading" ? (
        <StatusMessage>Loading...</StatusMessage>
      ) : state.status === "error" ? (
        <StatusMessage tone="error">{state.detail}</StatusMessage>
      ) : ranked.length === 0 ? (
        <StatusMessage>No rankings available yet.</StatusMessage>
      ) : (
        <div className="max-w-[900px] mx-auto">
          <div className="hidden md:grid grid-cols-[40px_1fr_repeat(8,60px)] gap-2 px-4 py-2 text-[11px] text-[#666] border-b border-[#333]">
            <span>#</span>
            <span>User</span>
            {SORT_OPTIONS.map((opt) => (
              <span
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`text-center cursor-pointer hover:text-[#ccc] ${sortBy === opt.key ? "text-[#5865F2]" : ""}`}
              >
                {opt.label}
              </span>
            ))}
          </div>

          <div className="space-y-2 md:space-y-0">
            {ranked.map((user, idx) => (
              <div
                key={user.discord_id}
                className="bg-[#1a1a1a] md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 md:grid md:grid-cols-[40px_1fr_repeat(8,60px)] md:gap-2 md:px-4 md:py-3 md:border-b md:border-[#222] md:hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3 md:mb-0 md:contents">
                  <RankBadge rank={idx + 1} />
                  <div className="flex items-center gap-2 md:gap-3">
                    <Avatar user={user} size="lg" />
                    <span className="text-[#f0f0f0] text-[13px]">{user.username}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center md:contents">
                  {SORT_OPTIONS.map((opt) => (
                    <div key={opt.key} className="md:flex md:items-center md:justify-center">
                      <span className="block md:hidden text-[9px] text-[#666] mb-1">{opt.label}</span>
                      <span className={`text-[12px] ${sortBy === opt.key ? "text-[#5865F2] font-bold" : "text-[#ccc]"}`}>
                        {user[opt.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
