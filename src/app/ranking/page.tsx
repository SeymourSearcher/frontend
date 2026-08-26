"use client";

import { useState, useMemo } from "react";
import { fetchRankings } from "@/lib/api";
import type { RankingUser } from "@/types/stats";
import { useAsyncData } from "@/hooks/useAsyncData";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Avatar } from "@/components/Avatar";

type SortKey = "total" | "t1" | "t2" | "t3" | "words" | "dupes" | "sets" | "dyed";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "total", label: "Total" },
  { key: "t1", label: "T1" },
  { key: "t2", label: "T2" },
  { key: "t3", label: "T3" },
  { key: "words", label: "Words" },
  { key: "dupes", label: "Dupes" },
  { key: "sets", label: "Sets" },
  { key: "dyed", label: "Dyed" },
];

function getStatValue(user: RankingUser, key: SortKey): number {
  const map: Record<SortKey, number> = {
    total: user.total_seymours,
    t1: user.t1,
    t2: user.t2,
    t3: user.t3,
    words: user.words,
    dupes: user.dupes,
    sets: user.total_sets,
    dyed: user.dyed_sets,
  };
  return map[key];
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "bg-yellow-500 text-black",
    2: "bg-gray-400 text-black",
    3: "bg-amber-700 text-white",
  };
  const baseClass = "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold";
  
  if (rank <= 3) {
    return <span className={`${baseClass} ${colors[rank]}`}>{rank}</span>;
  }
  return <span className={`${baseClass} bg-[#333] text-[#888]`}>{rank}</span>;
}

export default function RankingPage() {
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const { state } = useAsyncData(fetchRankings, []);

  const sortedRankings = useMemo(() => {
    if (state.status !== "success") return [];
    return [...state.data].sort((a, b) => getStatValue(b, sortBy) - getStatValue(a, sortBy));
  }, [state, sortBy]);

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
      ) : sortedRankings.length === 0 ? (
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
            {sortedRankings.map((user, idx) => (
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
                        {getStatValue(user, opt.key)}
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
