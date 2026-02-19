"use client";

import { useRef, useState, useEffect } from "react";

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleOption: (value: string) => void;
  label: string;
}

export default function MultiSelectDropdown({
  options,
  selected,
  allSelected,
  onToggleAll,
  onToggleOption,
  label,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let searchBuffer = "";
    let resetTimeout: NodeJS.Timeout;

    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (key.length !== 1 || !key.match(/[a-z0-9 ]/)) return;

      clearTimeout(resetTimeout);
      searchBuffer += key;
      resetTimeout = setTimeout(() => {
        searchBuffer = "";
      }, 1000);

      const match = options.find((opt) => opt.toLowerCase().startsWith(searchBuffer));
      if (match) {
        optionRefs.current.get(match)?.scrollIntoView({ block: "nearest" });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(resetTimeout);
    };
  }, [isOpen, options]);

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
        <div
          ref={listRef}
          className="absolute top-full left-0 mt-1 bg-[#222] border border-[#444] rounded shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto"
        >
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
              ref={(el) => {
                if (el) optionRefs.current.set(option, el);
              }}
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
