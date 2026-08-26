import { PIECE_INDEXES, PIECE_SLOT_NAMES, PieceIndex } from "@/lib/pieces";
import { ToggleButton } from "./ToggleButton";

interface HexPieceSelectorProps {
  selectedPieces: PieceIndex[];
  anySelected: boolean;
  onToggle: (piece: PieceIndex) => void;
  onToggleAny: () => void;
}

export function HexPieceSelector({
  selectedPieces,
  anySelected,
  onToggle,
  onToggleAny,
}: HexPieceSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      <ToggleButton selected={anySelected} onClick={onToggleAny}>
        Any
      </ToggleButton>
      {PIECE_INDEXES.map((piece) => (
        <ToggleButton
          key={piece}
          selected={selectedPieces.includes(piece)}
          onClick={() => onToggle(piece)}
          disabled={anySelected}
        >
          {PIECE_SLOT_NAMES[piece]}
        </ToggleButton>
      ))}
    </div>
  );
}
