interface ToggleButtonProps {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

/** Form toggle. Distinct from ui/FilterButton: no horizontal padding (sits in a
 *  grid cell) and carries a struck-through disabled state. */
export function ToggleButton({
  selected,
  onClick,
  disabled,
  children,
  className = "",
}: ToggleButtonProps) {
  const baseClass = "py-2 rounded text-[11px] border-none transition-colors";
  const stateClass = disabled
    ? "bg-[#222] text-[#555] cursor-not-allowed line-through"
    : selected
    ? "bg-[#5865F2] text-white cursor-pointer"
    : "bg-[#333] text-[#ccc] hover:bg-[#444] cursor-pointer";

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClass} ${stateClass} ${className}`}
    >
      {children}
    </button>
  );
}
