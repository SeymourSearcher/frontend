import { ReactNode } from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  size?: "default" | "compact";
}

const SIZES = { default: "px-3 py-1.5", compact: "px-2.5 py-1" };

export function TabButton({
  active,
  onClick,
  children,
  disabled,
  size = "default",
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${SIZES[size]} rounded text-[11px] border-none cursor-pointer transition-colors ${
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
