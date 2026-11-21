"use client";

import { Stats } from "@/types/stats";
import { StarIcon } from "@/components/icons/StarIcon";
import { StatItem } from "@/components/StatItem";
import { HexSearchInput } from "@/components/HexSearchInput";

interface HomeContentProps {
  stats: Stats | null;
}

const FONT = "font-['MinecraftSeven',Arial,sans-serif]";
const SEARCH_INPUT_CLASS = `flex-1 min-w-0 border border-r-0 border-[#666] bg-[#1a1a1a] text-[#eee] text-[15px] px-3 py-2.5 rounded-l-lg outline-none focus:border-[#888] ${FONT}`;
const SEARCH_BUTTON_CLASS = `shrink-0 bg-[#444] text-[#eee] border border-[#666] cursor-pointer text-[15px] px-5 rounded-r-lg hover:bg-[#555] ${FONT}`;

export function HomeContent({ stats }: HomeContentProps) {
  return (
    <section className={`max-w-[900px] mx-auto px-6 text-center ${FONT}`}>
      <h1 className="text-[2em] text-[#f0f0f0] mb-5">SeymourSearcher</h1>
      <div className="max-w-[560px] mx-auto mb-10">
        <HexSearchInput
          source="home"
          showHint={false}
          colorizeInput
          fullWidth
          inputClassName={SEARCH_INPUT_CLASS}
          buttonClassName={SEARCH_BUTTON_CLASS}
        />
      </div>

      <div className={stats ? "" : "invisible"}>
        <h2 className="text-[#f0f0f0] text-[14px] mb-4">Global Stats</h2>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-y-4 text-[#f0f0f0]">
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
    </section>
  );
}
