import { ReactNode } from "react";

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  size?: "default" | "compact";
  /** Inactive palette. The marketplace's is brighter; kept so merging the two
   *  copies of this component changed nothing visually. */
  tone?: "dim" | "bright";
}

const SIZES = { default: "px-3 py-1.5", compact: "px-3 py-1" };
const TONES = {
  dim: "bg-[#2a2a2a] text-[#888] hover:bg-[#333]",
  bright: "bg-[#333] text-[#ccc] hover:bg-[#444]",
};

export function FilterButton({
  active,
  onClick,
  children,
  size = "default",
  tone = "dim",
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${SIZES[size]} rounded text-[11px] border-none cursor-pointer transition-colors ${
        active ? "bg-[#5865F2] text-white" : TONES[tone]
      }`}
    >
      {children}
    </button>
  );
}
