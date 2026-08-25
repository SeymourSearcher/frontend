"use client";

import { Stats } from "@/types/stats";
import { StarIcon } from "@/components/icons/StarIcon";
import { StatItem } from "@/components/StatItem";
import { HexSearchInput } from "@/components/HexSearchInput";

interface HomeContentProps {
  stats: Stats | null;
}

export function HomeContent({ stats }: HomeContentProps) {
  return (
    <div className="text-center">
      <h1 className="text-[2em] text-[#f0f0f0] mb-5 font-['MinecraftSeven',Arial,sans-serif]">
        SeymourSearcher
      </h1>
      <div className="mb-6">
        <HexSearchInput showError={false} />
      </div>

      <div className={stats ? "" : "invisible"}>
        <h2 className="text-[#f0f0f0] text-[14px] mb-3 font-['MinecraftSeven',Arial,sans-serif]">Global Stats</h2>
        <div className="overflow-x-auto">
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
    </div>
  );
}
