import { PIECE_ITEM_NAMES, PieceIndex } from "@/lib/pieces";

interface MissingBadgeProps {
  pieces: PieceIndex[];
}

export default function MissingBadge({ pieces }: MissingBadgeProps) {
  if (!pieces.length) return null;
  return (
    <span className="text-[9px] text-[#ff6b6b] bg-[#3a2020] px-2 py-0.5 rounded">
      Missing: {pieces.map((p) => PIECE_ITEM_NAMES[p]).join(", ")}
    </span>
  );
}
