"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalStats } from "@/types/stats";
import { StarIcon } from "@/components/icons/StarIcon";
import { StatItem } from "@/components/StatItem";

interface HomeContentProps {
  stats: GlobalStats | null;
}

export function HomeContent({ stats }: HomeContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      const hexValue = searchQuery.trim().split("#").pop()?.toUpperCase() || "";
      if (hexValue) {
        router.push(`/hex/${hexValue}`);
      }
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-[2em] text-[#f0f0f0] mb-5 font-['MinecraftSeven',Arial,sans-serif]">
        SeymourSearcher
      </h1>
      <form onSubmit={handleSearch} className="inline-flex gap-[10px] mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="hexcode..."
          className="w-[280px] border border-[#666] bg-[#1a1a1a] text-[#eee] text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif] outline-none"
        />
        <button
          type="submit"
          className="bg-[#444] text-[#eee] border-none cursor-pointer text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif]"
        >
          Search
        </button>
      </form>

      <div className={stats ? "" : "invisible"}>
        <h2 className="text-[#f0f0f0] text-[14px] mb-3 font-['MinecraftSeven',Arial,sans-serif]">Global Stats</h2>
        <div className="inline-flex justify-center items-center gap-8 text-[#f0f0f0] font-['MinecraftSeven',Arial,sans-serif]">
          <StatItem label={<StarIcon />} value={stats?.stars ?? 0} />
          <StatItem label="T1" value={stats?.t1 ?? 0} />
          <StatItem label="T2" value={stats?.t2 ?? 0} />
          <StatItem label="T3" value={stats?.t3 ?? 0} />
          <StatItem label="Word" value={stats?.words ?? 0} />
          <StatItem label="Dupes" value={stats?.dupes ?? 0} />
          <StatItem label="Sets" value={stats?.total_sets ?? 0} />
          <StatItem label="Dyed" value={stats?.dyed_sets ?? 0} />
          <StatItem label="Total" value={stats?.total_seymours ?? 0} />
        </div>
      </div>
    </div>
  );
}
