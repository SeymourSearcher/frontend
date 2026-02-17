"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchHexInfo, HexInfo, HexUser, HexMatch } from "@/lib/api";

function Avatar({ user }: { user: HexUser }) {
  const defaultAvatarIndex = Number(BigInt(user.discord_id) >> BigInt(22)) % 6;
  const src = user.avatar_hash
    ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar_hash}.png`
    : `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;

  return <img src={src} alt={user.username} className="w-6 h-6 rounded-full" />;
}

function UserChip({ user }: { user: HexUser }) {
  return (
    <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2">
      <Avatar user={user} />
      <span className="text-[12px] text-[#ccc]">{user.username}</span>
      <span className="text-[10px] text-[#666]">ΔE: {user.delta_e}</span>
    </div>
  );
}

const TIER_CONFIG = {
  t1: { color: "text-green-400", label: "Tier 1 (ΔE 0-2)" },
  t2: { color: "text-yellow-400", label: "Tier 2 (ΔE 2-5)" },
  t3: { color: "text-orange-400", label: "Tier 3 (ΔE 5-10)" },
};

function TierSection({ tier, users }: { tier: string; users: HexUser[] }) {
  const [expanded, setExpanded] = useState(false);
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];

  if (users.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 text-[12px] ${config.color} cursor-pointer bg-transparent border-none`}
      >
        <span>{expanded ? "▼" : "▶"}</span>
        <span>{config.label}</span>
        <span className="text-[#666]">({users.length})</span>
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-2 mt-2">
          {users.map((user) => (
            <UserChip key={user.discord_id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function TierBadge({ tier, count }: { tier: string; count: number }) {
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
  if (count === 0) return null;
  return (
    <span className={`${config.color} text-[10px] bg-[#252525] px-2 py-1 rounded`}>
      {tier.toUpperCase()}: {count}
    </span>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

function calculateAbs(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

function ClosestMatchSidebar({ match, searchHex }: { match: HexMatch; searchHex: string }) {
  const absValue = calculateAbs(searchHex, match.target_hex);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 sticky top-6">
      <h3 className="text-[#888] text-[11px] uppercase tracking-wider mb-4">Closest Match</h3>
      
      <div className="flex gap-3 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded border border-[#333]" style={{ backgroundColor: `#${searchHex}` }} />
          <span className="text-[9px] text-[#666] mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#666]">
          <span className="text-[16px]">→</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded border border-[#333]" style={{ backgroundColor: `#${match.target_hex}` }} />
          <span className="text-[9px] text-[#666] mt-1">Match</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-[#f0f0f0] text-[14px] font-bold">{match.item_name}</div>
        <div className="text-[11px] font-bold mt-1" style={{ color: `#${match.target_hex}` }}>
          #{match.target_hex}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#252525] rounded p-3 text-center">
          <div className="text-[10px] text-[#666] uppercase">Delta E</div>
          <div className="text-[20px] text-[#5865F2] font-bold">{match.delta_e}</div>
        </div>
        <div className="bg-[#252525] rounded p-3 text-center">
          <div className="text-[10px] text-[#666] uppercase">ABS</div>
          <div className="text-[20px] text-[#5865F2] font-bold">{absValue}</div>
        </div>
      </div>

      <div className="text-[10px] text-[#888] mb-3">
        Pieces: {match.pieces.join(", ")}
      </div>

      <div className="border-t border-[#333] pt-3">
        <div className="text-[10px] text-[#666] uppercase mb-2">Users by Tier</div>
        <div className="space-y-2">
          {(["t1", "t2", "t3"] as const).map((tier) => {
            const users = match.users_by_tier[tier];
            const config = TIER_CONFIG[tier];
            return (
              <div key={tier} className="flex items-center justify-between">
                <span className={`text-[11px] ${config.color}`}>{config.label}</span>
                <span className="text-[11px] text-[#f0f0f0]">{users.length}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, rank }: { match: HexMatch; rank: number }) {
  const totalUsers = match.users_by_tier.t1.length + match.users_by_tier.t2.length + match.users_by_tier.t3.length;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center gap-4 mb-3">
        <span className="text-[#666] text-[14px]">#{rank}</span>
        <div
          className="w-10 h-10 rounded"
          style={{ backgroundColor: `#${match.target_hex}` }}
        />
        <div className="flex-1">
          <h3 className="text-[#f0f0f0] text-[14px]">{match.item_name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold" style={{ color: `#${match.target_hex}` }}>
              #{match.target_hex}
            </span>
            <span className="text-[#666] text-[10px]">ΔE: {match.delta_e}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <TierBadge tier="t1" count={match.users_by_tier.t1.length} />
          <TierBadge tier="t2" count={match.users_by_tier.t2.length} />
          <TierBadge tier="t3" count={match.users_by_tier.t3.length} />
        </div>
      </div>
      <div className="text-[10px] text-[#888] mb-3">
        Pieces: {match.pieces.join(", ")}
      </div>
      <TierSection tier="t1" users={match.users_by_tier.t1} />
      <TierSection tier="t2" users={match.users_by_tier.t2} />
      <TierSection tier="t3" users={match.users_by_tier.t3} />
      {totalUsers === 0 && (
        <p className="text-[#666] text-[11px] mt-2">No users have matching pieces</p>
      )}
    </div>
  );
}

function HexSearch({ initialHex, onSearch }: { initialHex: string; onSearch: (hex: string) => void }) {
  const [input, setInput] = useState(initialHex);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = input.replace(/^#/, "").toUpperCase();
    if (!/^[0-9A-F]{6}$/.test(cleaned)) {
      setError("Invalid hex code");
      return;
    }
    setError("");
    onSearch(cleaned);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 mb-6">
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded border border-[#444]"
          style={{ backgroundColor: /^[0-9A-Fa-f]{6}$/.test(input.replace(/^#/, "")) ? `#${input.replace(/^#/, "")}` : "#333" }}
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="FFFF00"
          maxLength={7}
          className="bg-[#222] text-[#f0f0f0] border border-[#444] rounded px-3 py-2 text-[14px] w-[120px] uppercase"
        />
        <button
          type="submit"
          className="bg-[#5865F2] text-white px-4 py-2 rounded text-[12px] border-none cursor-pointer hover:bg-[#4752C4] transition-colors"
        >
          Search
        </button>
      </div>
      {error && <span className="text-red-400 text-[11px]">{error}</span>}
    </form>
  );
}

export default function HexPage() {
  const params = useParams();
  const router = useRouter();
  const hexcode = (params.hexcode as string)?.toUpperCase() || "";
  
  const [hexInfo, setHexInfo] = useState<HexInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hexcode || !/^[0-9A-F]{6}$/.test(hexcode)) {
      setLoading(false);
      setError("Invalid hex code");
      return;
    }

    setLoading(true);
    setError("");
    fetchHexInfo(hexcode).then((data) => {
      if (data) {
        setHexInfo(data);
      } else {
        setError("Failed to fetch hex info");
      }
      setLoading(false);
    });
  }, [hexcode]);

  const handleSearch = (hex: string) => {
    router.push(`/hex/${hex}`);
  };

  return (
    <main className="min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-4 text-center">Hex Search</h1>
      
      <HexSearch initialHex={hexcode} onSearch={handleSearch} />

      {loading ? (
        <p className="text-[#888] text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : hexInfo && hexInfo.top_matches.length > 0 ? (
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded"
              style={{ backgroundColor: `#${hexInfo.hex_code}` }}
            />
            <div>
              <span className="text-[16px] font-bold" style={{ color: `#${hexInfo.hex_code}` }}>
                #{hexInfo.hex_code}
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-[280px] shrink-0">
              <ClosestMatchSidebar match={hexInfo.top_matches[0]} searchHex={hexInfo.hex_code} />
            </div>

            <div className="flex-1">
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
