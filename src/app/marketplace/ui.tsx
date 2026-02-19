"use client";

import { PIECE_NAMES } from "./constants";

export function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded text-[11px] border-none cursor-pointer transition-colors ${
        active
          ? "bg-[#5865F2] text-white"
          : "bg-[#333] text-[#ccc] hover:bg-[#444]"
      }`}
    >
      {children}
    </button>
  );
}

export function TabButton({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-[11px] border-none cursor-pointer transition-colors ${
        disabled
          ? "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
          : active
          ? "bg-[#444] text-white"
          : "bg-transparent text-[#888] hover:text-[#ccc]"
      }`}
    >
      {children}
    </button>
  );
}

export type OrderMode = "buy" | "sell";

export function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: OrderMode;
  onModeChange: (mode: OrderMode) => void;
}) {
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

export function PieceToggle({
  pieceIndex,
  selected,
  onToggle,
}: {
  pieceIndex: number;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-2 py-1 rounded text-[10px] border-none cursor-pointer transition-colors ${
        selected
          ? "bg-purple-600/50 text-purple-200"
          : "bg-[#2a2a2a] text-[#888] hover:bg-[#333]"
      }`}
    >
      {PIECE_NAMES[pieceIndex]}
    </button>
  );
}

export function LoginPromptModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#f0f0f0] mb-4">
          You need to login to access this feature.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded text-[12px] bg-[#333] text-[#ccc] border-none cursor-pointer hover:bg-[#444] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function SeymourPickerModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#f0f0f0] mb-4">
          To create sell orders, go to the Items page and use the "Sell" button to select seymours.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/items"
            className="px-4 py-2 rounded text-[12px] bg-[#4ade80] text-[#121212] border-none cursor-pointer hover:bg-[#22c55e] transition-colors font-bold no-underline"
          >
            Go to Items
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-[12px] bg-[#333] text-[#ccc] border-none cursor-pointer hover:bg-[#444] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
