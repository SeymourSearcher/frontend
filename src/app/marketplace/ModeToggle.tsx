"use client";

export type OrderMode = "buy" | "sell";

interface ModeToggleProps {
  mode: OrderMode;
  onModeChange: (mode: OrderMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-[11px] cursor-pointer transition-colors ${
          mode === "buy" ? "text-[#5865F2] font-bold" : "text-[#666] hover:text-[#888]"
        }`}
        onClick={() => onModeChange("buy")}
      >
        Buy
      </span>
      <button
        onClick={() => onModeChange(mode === "buy" ? "sell" : "buy")}
        className={`relative w-10 h-5 rounded-full border-none cursor-pointer transition-colors ${
          mode === "sell" ? "bg-[#4ade80]" : "bg-[#5865F2]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            mode === "sell" ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
      <span
        className={`text-[11px] cursor-pointer transition-colors ${
          mode === "sell" ? "text-[#4ade80] font-bold" : "text-[#666] hover:text-[#888]"
        }`}
        onClick={() => onModeChange("sell")}
      >
        Sell
      </span>
    </div>
  );
}
