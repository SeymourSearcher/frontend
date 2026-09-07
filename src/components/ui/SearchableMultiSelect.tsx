"use client";

import { useRef, useState, useEffect, useMemo } from "react";

export interface SelectOption {
  name: string;
  count: number;
}

interface SearchableMultiSelectProps {
  options: SelectOption[];
  selected: string[];
  /** True means "no filter", not "every option ticked" — see useSeymours. */
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleOption: (value: string) => void;
  label: string;
}

const ROW = "flex items-center gap-2 px-3 py-2 text-[12px] cursor-pointer";

/**
 * Multi-select with substring search and keyboard navigation.
 *
 * Replaces a native-select-style type-ahead that matched on prefix only and did
 * nothing but scroll, so `black` never reached `1.12+ Pure Black`. It also
 * listened on `document`, reacting to typing anywhere on the page.
 */
export function SearchableMultiSelect({
  options,
  selected,
  allSelected,
  onToggleAll,
  onToggleOption,
  label,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = needle
      ? options.filter((o) => o.name.toLowerCase().includes(needle))
      : options;

    // Ticked options float up, so a scattered selection is visible without
    // scrolling the whole list to find it.
    if (allSelected) return matching;
    const chosen = new Set(selected);
    return [
      ...matching.filter((o) => chosen.has(o.name)),
      ...matching.filter((o) => !chosen.has(o.name)),
    ];
  }, [options, query, selected, allSelected]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else setQuery("");
  }, [isOpen]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function choose(name: string) {
    // Picking one while "All" is on collapses to that single selection.
    if (allSelected) onToggleAll();
    onToggleOption(name);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) => (i + step + visible.length) % Math.max(visible.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = visible[activeIndex];
      if (option) choose(option.name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const buttonLabel = allSelected
    ? `All ${label}`
    : selected.length === 0
      ? `Select ${label}`
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

  return (
    <div ref={containerRef} className="relative">
      {/* Rendered rather than hidden while the options are still loading, so the
          row it sits in keeps its height. Nothing to open until they arrive. */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="bg-[#222] text-[#ccc] border border-[#444] rounded px-3 py-1 text-[12px] cursor-pointer flex items-center gap-2 min-w-[160px] justify-between disabled:opacity-50 disabled:cursor-default"
      >
        <span className="truncate">{buttonLabel}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#222] border border-[#444] rounded shadow-lg z-50 min-w-[240px]">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${label.toLowerCase()}...`}
            aria-label={`Search ${label}`}
            className="w-full bg-[#1a1a1a] text-[#eee] text-[12px] px-3 py-2 border-b border-[#444] outline-none font-['MinecraftSeven',Arial,sans-serif]"
          />

          <div role="listbox" aria-multiselectable className="max-h-[280px] overflow-y-auto">
            <button
              type="button"
              onClick={onToggleAll}
              className={`w-full text-left px-3 py-2 text-[12px] border-b border-[#444] cursor-pointer ${
                allSelected ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
              }`}
            >
              All
            </button>

            {visible.length === 0 ? (
              <p className="px-3 py-3 text-[11px] text-[#666]">No matches</p>
            ) : (
              visible.map((option, i) => {
                const isSelected = !allSelected && selected.includes(option.name);
                return (
                  <div
                    key={option.name}
                    ref={i === activeIndex ? activeRef : undefined}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => choose(option.name)}
                    className={`${ROW} justify-between ${i === activeIndex ? "bg-[#333]" : ""}`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        tabIndex={-1}
                        className="w-3.5 h-3.5 accent-[#5865F2] pointer-events-none shrink-0"
                      />
                      <span className="text-[#ccc] truncate">{option.name}</span>
                    </span>
                    <span className="text-[10px] text-[#666] shrink-0">{option.count}</span>
                  </div>
                );
              })
            )}
          </div>

          {!allSelected && selected.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-[#444] text-[11px]">
              <span className="text-[#666]">{selected.length} selected</span>
              <button
                type="button"
                onClick={onToggleAll}
                className="text-[#5865F2] hover:underline cursor-pointer bg-transparent border-none font-['MinecraftSeven',Arial,sans-serif] text-[11px]"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
