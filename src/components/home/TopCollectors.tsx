import Link from "next/link";
import type { RankingUser } from "@/types/stats";
import { Avatar } from "@/components/Avatar";
import { RankBadge } from "@/components/RankBadge";

const TIER_COLORS = ["text-green-400", "text-yellow-400", "text-orange-400"] as const;

function CollectorCard({ user, rank }: { user: RankingUser; rank: number }) {
  const tiers = [user.t1, user.t2, user.t3];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 flex items-center gap-3">
      <RankBadge rank={rank} size="lg" />
      <Avatar user={user} size="lg" alt="" />

      <div className="min-w-0 flex-1">
        <div className="text-[#f0f0f0] text-[13px] truncate">{user.username}</div>
        <div className="text-[#666] text-[11px]">
          {user.total_seymours.toLocaleString()} seymours
        </div>
      </div>

      <div className="flex gap-3 shrink-0">
        {tiers.map((count, index) => (
          <div key={index} className="text-center">
            <div className={`text-[11px] ${TIER_COLORS[index]}`}>T{index + 1}</div>
            <div className="text-[#ccc] text-[11px]">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopCollectors({ users }: { users: RankingUser[] }) {
  if (users.length === 0) return null;

  return (
    <section className="max-w-[900px] mx-auto px-6 mt-14 font-['MinecraftSeven',Arial,sans-serif]">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-[#f0f0f0] text-[14px]">Top Collectors</h2>
        <Link href="/ranking" className="text-[#5865F2] text-[11px] no-underline hover:underline">
          Full rankings →
        </Link>
      </div>

      <div className="space-y-2">
        {users.map((user, index) => (
          <CollectorCard key={user.discord_id} user={user} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
