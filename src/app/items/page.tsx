"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useSeymours } from "@/hooks/useSeymours";
import { Seymour } from "@/types/seymour";

function SeymourCard({ seymour }: { seymour: Seymour }) {
  return (
    <Link href={`/hex/${seymour.hex_color}`} className="block">
      <div className="bg-[#1a1a1a] rounded-lg p-3 flex flex-col items-center hover:bg-[#252525] transition-colors cursor-pointer">
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
    </Link>
  );
}

function SeymourChip({ seymour }: { seymour: Seymour }) {
  return (
    <Link href={`/hex/${seymour.hex_color}`} className="block">
      <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2 hover:bg-[#333] transition-colors cursor-pointer">
        <div className="w-6 h-6 rounded" style={{ backgroundColor: `#${seymour.hex_color}` }} />
        <div className="flex flex-col">
          <span className="text-[11px] font-bold" style={{ color: `#${seymour.hex_color}` }}>
            #{seymour.hex_color}
          </span>
          <span className="text-[#888] text-[9px]">{seymour.item_name}</span>
          {seymour.match && <span className="text-[#666] text-[8px]">ΔE: {seymour.match.delta_e}</span>}
        </div>
      </div>
    </Link>
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

function MissingItem({ pieceName, hexColor }: { pieceName: string; hexColor: string }) {
  return (
    <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2 ring-2 ring-[#ff4444] ring-opacity-70">
      <div className="w-6 h-6 rounded opacity-50" style={{ backgroundColor: `#${hexColor}` }} />
      <div className="flex flex-col">
        <span className="text-[11px] font-bold opacity-50" style={{ color: `#${hexColor}` }}>
          #{hexColor}
        </span>
        <span className="text-[#ff6b6b] text-[9px]">{pieceName}</span>
      </div>
    </div>
  );
}

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleOption: (value: string) => void;
  label: string;
}

function MultiSelectDropdown({ options, selected, allSelected, onToggleAll, onToggleOption, label }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getButtonLabel = () => {
    if (allSelected) return `All ${label}`;
    if (selected.length === 0) return `Select ${label}`;
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
  };

  const handleOptionClick = (option: string) => {
    if (allSelected) {
      onToggleAll();
    }
    onToggleOption(option);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#222] text-[#ccc] border border-[#444] rounded px-3 py-1 text-[12px] cursor-pointer flex items-center gap-2 min-w-[160px] justify-between"
      >
        <span className="truncate">{getButtonLabel()}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#222] border border-[#444] rounded shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
          <button
            type="button"
            onClick={onToggleAll}
            className={`w-full text-left px-3 py-2 text-[12px] border-b border-[#444] cursor-pointer transition-colors ${
              allSelected ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
            }`}
          >
            All
          </button>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className="flex items-center gap-2 px-3 py-2 text-[12px] cursor-pointer transition-colors hover:bg-[#333]"
            >
              <input
                type="checkbox"
                checked={!allSelected && selected.includes(option)}
                onChange={() => {}}
                className="w-3.5 h-3.5 accent-[#5865F2] pointer-events-none"
              />
              <span className="text-[#ccc] truncate">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ItemsPage() {
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
            {stats && f.key !== "all" && f.key !== "custom" && <span className="ml-1 opacity-70">({getStatCount(f.key)})</span>}
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
                  {items.map((s, idx) => <SeymourChip key={`${groupName}-${idx}`} seymour={s} />)}
                  {incompleteOnly && missing.map((piece) => (
                    <MissingItem key={piece} pieceName={piece} hexColor={targetHex} />
                  ))}
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
