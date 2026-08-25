import { PIECE_ITEM_NAMES, PieceIndex } from "@/lib/pieces";

interface MissingItemProps {
  piece: PieceIndex;
  hexColor: string;
}

export default function MissingItem({ piece, hexColor }: MissingItemProps) {
  return (
    <div className="flex items-center gap-2 bg-[#252525] rounded px-3 py-2 ring-2 ring-[#ff4444] ring-opacity-70">
      <div className="w-6 h-6 rounded opacity-50" style={{ backgroundColor: `#${hexColor}` }} />
      <div className="flex flex-col">
        <span className="text-[11px] font-bold opacity-50" style={{ color: `#${hexColor}` }}>
          #{hexColor}
        </span>
        <span className="text-[#ff6b6b] text-[9px]">{PIECE_ITEM_NAMES[piece]}</span>
      </div>
    </div>
  );
}
