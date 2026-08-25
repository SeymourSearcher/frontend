import { PIECE_SLOT_NAMES, PieceIndex } from "@/lib/pieces";

interface PieceToggleProps {
  pieceIndex: PieceIndex;
  selected: boolean;
  onToggle: () => void;
  size?: "default" | "compact";
}

const SIZES = { default: "px-2.5 py-1", compact: "px-2 py-1" };

export function PieceToggle({
  pieceIndex,
  selected,
  onToggle,
  size = "default",
}: PieceToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`${SIZES[size]} rounded text-[10px] border-none cursor-pointer transition-colors ${
        selected
          ? "bg-purple-600/50 text-purple-200"
          : "bg-[#2a2a2a] text-[#888] hover:bg-[#333]"
      }`}
    >
      {PIECE_SLOT_NAMES[pieceIndex]}
    </button>
  );
}
