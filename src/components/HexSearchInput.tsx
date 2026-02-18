"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cleanHexInput, isValidHex } from "@/lib/hex";

interface HexSearchInputProps {
  initialValue?: string;
  showPreview?: boolean;
  showError?: boolean;
  colorizeInput?: boolean;
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
  children?: ReactNode;
}

export function HexSearchInput({
  initialValue = "",
  showPreview = false,
  showError = true,
  colorizeInput = false,
  placeholder = "hexcode...",
  inputClassName = "w-[280px] border border-[#666] bg-[#1a1a1a] text-[#eee] text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif] outline-none",
  buttonClassName = "bg-[#444] text-[#eee] border-none cursor-pointer text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif]",
  children,
}: HexSearchInputProps) {
  const [input, setInput] = useState(initialValue);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = cleanHexInput(input);
    
    if (!cleaned) return;
    
    if (showError && !isValidHex(cleaned)) {
      setError("Invalid hex code");
      return;
    }
    
    setError("");
    router.push(`/hex/${cleaned}`);
  }

  const cleaned = cleanHexInput(input);
  const isValid = isValidHex(cleaned);
  const previewColor = showPreview && isValid ? `#${cleaned}` : "#333";
  const inputColor = colorizeInput && isValid ? `#${cleaned}` : undefined;

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
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          maxLength={showPreview ? 7 : undefined}
          className={inputClassName}
          style={inputColor ? { color: inputColor } : undefined}
        />
        <button type="submit" className={buttonClassName}>
          Search
        </button>
        {children}
      </div>
      {showError && error && <span className="text-red-400 text-[11px]">{error}</span>}
    </form>
  );
}
