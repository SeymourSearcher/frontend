"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cleanHexInput, isValidHex } from "@/lib/hex";

interface HexSearchInputProps {
  initialValue?: string;
  showPreview?: boolean;
  showError?: boolean;
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function HexSearchInput({
  initialValue = "",
  showPreview = false,
  showError = true,
  placeholder = "hexcode...",
  inputClassName = "w-[280px] border border-[#666] bg-[#1a1a1a] text-[#eee] text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif] outline-none",
  buttonClassName = "bg-[#444] text-[#eee] border-none cursor-pointer text-[14px] p-2 rounded-lg font-['MinecraftSeven',Arial,sans-serif]",
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

  const previewColor = showPreview && isValidHex(cleanHexInput(input)) 
    ? `#${cleanHexInput(input)}` 
    : "#333";

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
        />
        <button type="submit" className={buttonClassName}>
          Search
        </button>
      </div>
      {showError && error && <span className="text-red-400 text-[11px]">{error}</span>}
    </form>
  );
}
