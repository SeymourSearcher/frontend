"use client";

import { useSeymours } from "@/hooks/useSeymours";
import { Seymour } from "@/types/seymour";

function SeymourCard({ seymour }: { seymour: Seymour }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-3 flex flex-col items-center">
      <div
        className="w-10 h-10 rounded mb-2"
        style={{ backgroundColor: `#${seymour.hex_color}` }}
      />
      <span className="text-[11px] mb-1 font-bold" style={{ color: `#${seymour.hex_color}` }}>
        #{seymour.hex_color}
      </span>
      <span className="text-[#888] text-[9px] mb-1">{seymour.item_name}</span>
      {seymour.match && (
        <div className="text-center mt-1">
          <span className="text-[#5865F2] text-[9px] block">{seymour.match.target_name}</span>
          <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>
        </div>
      )}
    </div>
  );
}

function SeymourChip({ seymour }: { seymour: Seymour }) {
  return (
    <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2">
      <div className="w-6 h-6 rounded" style={{ backgroundColor: `#${seymour.hex_color}` }} />
      <div className="flex flex-col">
        <span className="text-[11px] font-bold" style={{ color: `#${seymour.hex_color}` }}>
          #{seymour.hex_color}
        </span>
        <span className="text-[#888] text-[9px]">{seymour.item_name}</span>
        {seymour.match && <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>}
      </div>
    </div>
  );
}

function MissingBadge({ pieces }: { pieces: string[] }) {
  if (!pieces.length) return null;
  return (
    <span className="text-[9px] text-[#ff6b6b] bg-[#3a2020] px-2 py-0.5 rounded">
      Missing: {pieces.join(", ")}
    </span>
  );
}

export default function ItemsPage() {
  const {
    stats,
    filter,
    setFilter,
    subFilter,
    setSubFilter,
    availableSubFilters,
    loading,
    hasSubFilter,
    shouldGroup,
    groupedSeymours,
    seymours,
    getStatCount,
    getSubFilterLabel,
    FILTERS,
    incompleteOnly,
    setIncompleteOnly,
    canFilterIncomplete,
  } = useSeymours();

  return (
    <main className="min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-4 text-center">My Seymours</h1>

      {stats && <p className="text-[#888] text-center mb-4 text-[12px]">Total: {stats.total_seymours}</p>}

      <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded text-[12px] border-none cursor-pointer transition-colors ${
              filter === f.key ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
            }`}
          >
            {f.label}
            {stats && f.key !== "all" && <span className="ml-1 opacity-70">({getStatCount(f.key)})</span>}
          </button>
        ))}
        {canFilterIncomplete && (
          <label className="flex items-center gap-1.5 ml-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incompleteOnly}
              onChange={(e) => setIncompleteOnly(e.target.checked)}
              className="w-4 h-4 accent-[#5865F2] cursor-pointer"
            />
            <span className="text-[12px] text-[#ccc]">Missing only</span>
          </label>
        )}
      </div>

      {hasSubFilter && availableSubFilters.length > 0 && (
        <div className="flex justify-center mb-6">
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className="bg-[#222] text-[#ccc] border border-[#444] rounded px-3 py-1 text-[12px] cursor-pointer"
          >
            <option value="">All {getSubFilterLabel()}</option>
            {availableSubFilters.map((sf) => (
              <option key={sf} value={sf}>{sf}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-[#888] text-center">Loading...</p>
      ) : seymours.length === 0 ? (
        <p className="text-[#888] text-center">No seymours found. Upload an export first!</p>
      ) : shouldGroup ? (
        <div className="max-w-[1200px] mx-auto space-y-6">
          {Object.entries(groupedSeymours).map(([groupName, items]) => {
            const missing = items[0]?.match?.missing || [];
            return (
              <div key={groupName} className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3 border-b border-[#333] pb-2">
                  <h3 className="text-[#5865F2] text-[14px]">{groupName}</h3>
                  <MissingBadge pieces={missing} />
                </div>
                <div className="flex flex-wrap gap-3">
                  {items.map((s) => <SeymourChip key={s.id} seymour={s} />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 max-w-[1200px] mx-auto">
          {seymours.map((s) => <SeymourCard key={s.id} seymour={s} />)}
        </div>
      )}
    </main>
  );
}
