import { Tier } from "@/types/marketplace";
import { PieceIndex } from "@/lib/pieces";
import { ToggleButton } from "./ToggleButton";
import { PieceSelector } from "./PieceSelector";
import { INPUT_CLASS, LABEL_CLASS } from "./formStyles";

interface SetPieceFieldsProps {
  sets: string[];
  setName: string;
  availablePieces: PieceIndex[];
  selectedPieceTypes: PieceIndex[];
  tier: Tier;
  onSetNameChange: (setName: string) => void;
  onPieceToggle: (piece: PieceIndex) => void;
  onTierChange: (tier: Tier) => void;
}

export function SetPieceFields({
  sets,
  setName,
  availablePieces,
  selectedPieceTypes,
  tier,
  onSetNameChange,
  onPieceToggle,
  onTierChange,
}: SetPieceFieldsProps) {
  return (
    <>
      <div>
        <label className={LABEL_CLASS}>Set Name</label>
        <select
          value={setName}
          onChange={(e) => onSetNameChange(e.target.value)}
          className={`w-full ${INPUT_CLASS}`}
          required
        >
          {sets.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={LABEL_CLASS}>
          Piece Types ({selectedPieceTypes.length} selected)
        </label>
        <PieceSelector
          selectedPieces={selectedPieceTypes}
          availablePieces={availablePieces}
          onToggle={onPieceToggle}
        />
        {availablePieces.length < 4 && (
          <p className="text-[#666] text-[10px] mt-1">
            Crossed out pieces are not available for this set
          </p>
        )}
      </div>

      <div>
        <label className={LABEL_CLASS}>Tier</label>
        <div className="flex gap-2">
          {Object.values(Tier).map((t) => (
            <ToggleButton
              key={t}
              selected={tier === t}
              onClick={() => onTierChange(t)}
              className="flex-1 text-[12px]"
            >
              {t.toUpperCase()}
            </ToggleButton>
          ))}
        </div>
      </div>
    </>
  );
}
