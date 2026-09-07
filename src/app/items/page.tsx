"use client";

import { useState, useEffect, useMemo } from "react";
import { useSeymours } from "@/hooks/useSeymours";
import { useSellMode } from "@/hooks/useSellMode";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserSeymourHexes } from "@/lib/api";
import { StatusMessage } from "@/components/ui/StatusMessage";
import SeymourCard from "./SeymourCard";
import SeymourChip from "./SeymourChip";
import MissingBadge from "./MissingBadge";
import MissingItem from "./MissingItem";
import MultiSelectDropdown from "./MultiSelectDropdown";
import SellActionBar from "./SellActionBar";
import VisualizeModal from "./VisualizeModal";
import LoggedOutPreview from "./LoggedOutPreview";
import { RemoveMyData } from "./RemoveMyData";
import { PieceIndex } from "@/lib/pieces";

export default function ItemsPage() {
  const { user, loading: authLoading } = useAuth();
  // Hooks run before the logged-out early return below, so the gate has to live here.
  const isAuthed = !authLoading && !!user;
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
    error: loadError,
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
    reload,
  } = useSeymours(isAuthed);

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

  const [showVisualizeModal, setShowVisualizeModal] = useState(false);
  const [userSeymours, setUserSeymours] = useState<[string, PieceIndex][]>([]);

  useEffect(() => {
    if (!isAuthed) return;
    fetchUserSeymourHexes().then((result) => {
      if (result.ok) setUserSeymours(result.data);
    });
  }, [isAuthed]);

  const userHexes = useMemo(
    () => [...new Set(userSeymours.map(([hex]) => hex))],
    [userSeymours]
  );

  const mainClasses = `min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif] ${sellMode ? "pb-24" : ""}`;

  if (!authLoading && !user) {
    return (
      <main className={mainClasses}>
        <h1 className="text-[1.5em] text-[#f0f0f0] mb-4 text-center">My Seymours</h1>
        <LoggedOutPreview />
      </main>
    );
  }

  return (
    <main className={mainClasses}>
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-4 text-center">My Seymours</h1>

      {stats &&<p className="text-[#888] text-center mb-4 text-[12px]">Total: {stats.total_seymours}</p>}

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

      {/* One wrap context: nesting the chips let the checkbox group's fixed
          width squeeze them, stranding Visualize on a line of its own. */}
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
        <button
          onClick={() => setShowVisualizeModal(true)}
          className="px-3 py-1 rounded text-[12px] border-none cursor-pointer ml-2 bg-[#333] text-[#ccc] hover:bg-[#444]"
        >
          Visualize
        </button>
        {/* Wraps as a unit; the reserved width keeps the row steady as the
            conditional checkboxes come and go. */}
        <div className="flex items-center gap-2 min-w-[200px]">
          {canIncludeDyes && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDyes}
                onChange={(e) => setIncludeDyes(e.target.checked)}
                className="w-4 h-4 accent-[#5865F2] cursor-pointer"
              />
              <span className="text-[12px] text-[#ccc]">Include dyes</span>
            </label>
          )}
          {canFilterIncomplete && (
            <label className="flex items-center gap-1.5 cursor-pointer">
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
        <StatusMessage>Loading...</StatusMessage>
      ) : loadError ? (
        <StatusMessage tone="error">{loadError}</StatusMessage>
      ) : seymours.length === 0 ? (
        <StatusMessage>No seymours found. Upload an export first!</StatusMessage>
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
                  {items.map((s) => (
                    <SeymourChip
                      key={s.id}
                      seymour={s}
                      sellMode={sellMode}
                      isSelected={isSelected(s.id)}
                      onSelect={toggleSelection}
                    />
                  ))}
                  {incompleteOnly &&
                    missing.map((piece) => (
                      <MissingItem key={piece} piece={piece} hexColor={targetHex} />
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

      {/* Below the collection, so what is about to go is on screen. It hides
          itself when there is nothing to remove -- gating on the count here
          would unmount the result the moment the refetch reported zero. */}
      {!sellMode && stats && (
        <RemoveMyData total={stats.total_seymours} onRemoved={reload} />
      )}

      <VisualizeModal isOpen={showVisualizeModal} onClose={() => setShowVisualizeModal(false)} userHexes={userHexes} userSeymours={userSeymours} />
    </main>
  );
}
