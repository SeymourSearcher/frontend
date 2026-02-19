"use client";

import { useSeymours } from "@/hooks/useSeymours";
import { useSellMode } from "@/hooks/useSellMode";
import { useAuth } from "@/hooks/useAuth";
import SeymourCard from "./SeymourCard";
import SeymourChip from "./SeymourChip";
import MissingBadge from "./MissingBadge";
import MissingItem from "./MissingItem";
import MultiSelectDropdown from "./MultiSelectDropdown";
import SellActionBar from "./SellActionBar";

export default function ItemsPage() {
  const { user } = useAuth();
  const {
    stats,
    filter,
    setFilter,
    selectedSubFilters,
    toggleSubFilter,
    allSelected,
    toggleAllSelected,
    availableSubFilters,
    loading,
    hasSubFilter,
    shouldGroup,
    groupedSeymours,
    seymours,
    getStatCount,
    getSubFilterLabel,
    getGroupAverage,
    FILTERS,
    incompleteOnly,
    setIncompleteOnly,
    canFilterIncomplete,
    includeDyes,
    setIncludeDyes,
    canIncludeDyes,
    sortDirection,
    toggleSort,
  } = useSeymours();

  const {
    sellMode,
    toggleSellMode,
    selectedCount,
    toggleSelection,
    clearSelection,
    isSelected,
    price,
    setPrice,
    isSubmitting,
    error,
    setError,
    successCount,
    dismissSuccess,
    submitSellOrders,
  } = useSellMode();

  return (
    <main className={`min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif] ${sellMode ? "pb-24" : ""}`}>
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-4 text-center">My Seymours</h1>

      {stats && <p className="text-[#888] text-center mb-4 text-[12px]">Total: {stats.total_seymours}</p>}

      {successCount !== null && (
        <div className="max-w-[600px] mx-auto mb-4 bg-[#1a3a1a] border border-[#4ade80] rounded-lg p-3 flex items-center justify-between">
          <span className="text-[#4ade80] text-[12px]">
            Successfully listed {successCount} seymour{successCount !== 1 ? "s" : ""} for sale!
          </span>
          <button
            onClick={dismissSuccess}
            className="text-[#4ade80] hover:text-[#22c55e] text-[14px]"
          >
            ×
          </button>
        </div>
      )}

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
            {stats && f.key !== "all" && f.key !== "custom" && (
              <span className="ml-1 opacity-70">({getStatCount(f.key)})</span>
            )}
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
        {canIncludeDyes && (
          <label className="flex items-center gap-1.5 ml-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDyes}
              onChange={(e) => setIncludeDyes(e.target.checked)}
              className="w-4 h-4 accent-[#5865F2] cursor-pointer"
            />
            <span className="text-[12px] text-[#ccc]">Include dyes</span>
          </label>
        )}
        <button
          onClick={toggleSort}
          className={`px-3 py-1 rounded text-[12px] border-none cursor-pointer ml-2 flex items-center gap-1 ${
            sortDirection ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
          }`}
        >
          ΔE {sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : ""}
        </button>

        {user && (
          <button
            onClick={toggleSellMode}
            className={`px-3 py-1 rounded text-[12px] border-none cursor-pointer ml-2 ${
              sellMode ? "bg-[#4ade80] text-[#121212]" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
            }`}
          >
            {sellMode ? "Exit Sell Mode" : "Sell"}
          </button>
        )}
      </div>

      {hasSubFilter && availableSubFilters.length > 0 && (
        <div className="flex justify-center mb-6">
          <MultiSelectDropdown
            options={availableSubFilters}
            selected={selectedSubFilters}
            allSelected={allSelected}
            onToggleAll={toggleAllSelected}
            onToggleOption={toggleSubFilter}
            label={getSubFilterLabel()}
          />
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
            const targetHex = items[0]?.match?.target_hex || "";
            const avg = getGroupAverage(items);
            return (
              <div key={groupName} className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3 border-b border-[#333] pb-2">
                  <h3 className="text-[#5865F2] text-[14px]">{groupName}</h3>
                  <span className="text-[#666] text-[11px]">Avg ΔE: {avg.toFixed(2)}</span>
                  {!incompleteOnly && <MissingBadge pieces={missing} />}
                </div>
                <div className="flex flex-wrap gap-3">
                  {items.map((s, idx) => (
                    <SeymourChip
                      key={`${groupName}-${idx}`}
                      seymour={s}
                      sellMode={sellMode}
                      isSelected={isSelected(s.id)}
                      onSelect={toggleSelection}
                    />
                  ))}
                  {incompleteOnly &&
                    missing.map((piece) => (
                      <MissingItem key={piece} pieceName={piece} hexColor={targetHex} />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 max-w-[1200px] mx-auto">
          {seymours.map((s) => (
            <SeymourCard
              key={s.id}
              seymour={s}
              sellMode={sellMode}
              isSelected={isSelected(s.id)}
              onSelect={toggleSelection}
            />
          ))}
        </div>
      )}

      {sellMode && (
        <SellActionBar
          selectedCount={selectedCount}
          price={price}
          onPriceChange={setPrice}
          onSubmit={submitSellOrders}
          onCancel={toggleSellMode}
          onClear={clearSelection}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </main>
  );
}
