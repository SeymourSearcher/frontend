"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { track, type SearchSource } from "@/lib/analytics";
import {
  HEX_LENGTH,
  hasWildcard,
  isHexPrefix,
  isValidPattern,
  sanitizePatternInput,
} from "@/lib/hex";

interface HexSearchInputProps {
  source: SearchSource;
  initialValue?: string;
  showPreview?: boolean;
  showHint?: boolean;
  colorizeInput?: boolean;
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
  /** Fired only on a real navigation, so a container can dismiss itself. */
  onNavigate?: () => void;
  children?: ReactNode;
}

export function HexSearchInput({
  source,
  initialValue = "",
  showPreview = false,
  showHint = true,
  colorizeInput = false,
  placeholder = "hexcode or pattern...",
  inputClassName = "w-[280px] border border-[#666] bg-[#1a1a1a] text-[#eee] text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif] outline-none",
  buttonClassName = "bg-[#444] text-[#eee] border-none cursor-pointer text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif]",
  onNavigate,
  children,
}: HexSearchInputProps) {
  const [input, setInput] = useState(sanitizePatternInput(initialValue));
  const router = useRouter();

  const isValid = isValidPattern(input);
  const remaining = HEX_LENGTH - input.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    if (hasWildcard(input)) {
      track("pattern_searched", { pattern: input, source });
      router.push(`/search?p=${encodeURIComponent(input)}`);
    } else {
      track("hex_searched", { hex: input, source });
      router.push(`/hex/${input}`);
    }
    onNavigate?.();
  }

  // Padding the partial code lets the colour drift toward the real one while
  // typing and land on it exactly at six characters. A pattern has no colour to
  // drift toward, and `#X2XYZZ` would silently fall back mid-word.
  const partialColor =
    input.length > 0 && isHexPrefix(input) ? `#${input.padEnd(HEX_LENGTH, "0")}` : null;
  const previewColor = showPreview ? partialColor ?? "#333" : "#333";
  const inputColor = colorizeInput ? partialColor ?? undefined : undefined;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {showPreview && (
          <div
            className="w-10 h-10 rounded border border-[#444]"
            style={{ backgroundColor: previewColor }}
          />
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(sanitizePatternInput(e.target.value))}
          placeholder={placeholder}
          maxLength={HEX_LENGTH}
          className={inputClassName}
          // The glow is what keeps a dark hex legible against the dark field.
          style={
            inputColor
              ? { color: inputColor, textShadow: "0 0 3px rgba(255,255,255,0.45)" }
              : undefined
          }
        />
        <button
          type="submit"
          disabled={!isValid}
          className={`${buttonClassName} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          Search
        </button>
        {children}
      </div>
      {/* Always rendered: letting it appear and vanish shifts everything below. */}
      {showHint && (
        <span className="text-[#888] text-[11px] h-[13px] leading-[13px]">
          {input.length > 0 && !isValid
            ? `${remaining} more character${remaining === 1 ? "" : "s"}`
            : " "}
        </span>
      )}
    </form>
  );
}
