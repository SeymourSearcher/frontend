import { PIECE_INDEXES, PIECE_SLOT_NAMES, PieceIndex } from "@/lib/pieces";
import { ToggleButton } from "./ToggleButton";

interface PieceSelectorProps {
  selectedPieces: PieceIndex[];
  availablePieces: PieceIndex[];
  onToggle: (piece: PieceIndex) => void;
}

export function PieceSelector({
  selectedPieces,
  availablePieces,
  onToggle,
}: PieceSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {PIECE_INDEXES.map((piece) => (
        <ToggleButton
          key={piece}
          selected={selectedPieces.includes(piece)}
          disabled={!availablePieces.includes(piece)}
          onClick={() => onToggle(piece)}
        >
          {PIECE_SLOT_NAMES[piece]}
        </ToggleButton>
      ))}
    </div>
  );
}
