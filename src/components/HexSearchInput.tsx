"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { HEX_LENGTH, isValidHex, sanitizeHexInput } from "@/lib/hex";

interface HexSearchInputProps {
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
  initialValue = "",
  showPreview = false,
  showHint = true,
  colorizeInput = false,
  placeholder = "hexcode...",
  inputClassName = "w-[280px] border border-[#666] bg-[#1a1a1a] text-[#eee] text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif] outline-none",
  buttonClassName = "bg-[#444] text-[#eee] border-none cursor-pointer text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif]",
  onNavigate,
  children,
}: HexSearchInputProps) {
  const [input, setInput] = useState(sanitizeHexInput(initialValue));
  const router = useRouter();

  const isValid = isValidHex(input);
  const remaining = HEX_LENGTH - input.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.push(`/hex/${input}`);
    onNavigate?.();
  }

  const previewColor = showPreview && isValid ? `#${input}` : "#333";
  const inputColor = colorizeInput && isValid ? `#${input}` : undefined;

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
          onChange={(e) => setInput(sanitizeHexInput(e.target.value))}
          placeholder={placeholder}
          maxLength={HEX_LENGTH}
          className={inputClassName}
          style={inputColor ? { color: inputColor } : undefined}
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
      {showHint && input.length > 0 && !isValid && (
        <span className="text-[#888] text-[11px]">
          {remaining} more character{remaining === 1 ? "" : "s"}
        </span>
      )}
    </form>
  );
}
