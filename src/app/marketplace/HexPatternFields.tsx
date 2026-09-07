import { HexMatchType } from "@/types/marketplace";
import { PieceIndex } from "@/lib/pieces";
import { HEX_LENGTH, isValidHex, sanitizeHexInput } from "@/lib/hex";
import { ToggleButton } from "./ToggleButton";
import { HexPieceSelector } from "./HexPieceSelector";
import { INPUT_CLASS, LABEL_CLASS } from "./formStyles";

interface HexPatternFieldsProps {
  hexMatchType: HexMatchType;
  hexValue: string;
  maxDeltaE: string;
  hexPieceTypes: PieceIndex[];
  hexAnyPiece: boolean;
  onHexMatchTypeChange: (matchType: HexMatchType) => void;
  onHexValueChange: (hexValue: string) => void;
  onMaxDeltaEChange: (maxDeltaE: string) => void;
  onHexPieceToggle: (piece: PieceIndex) => void;
  onHexAnyToggle: () => void;
}

export function HexPatternFields({
  hexMatchType,
  hexValue,
  maxDeltaE,
  hexPieceTypes,
  hexAnyPiece,
  onHexMatchTypeChange,
  onHexValueChange,
  onMaxDeltaEChange,
  onHexPieceToggle,
  onHexAnyToggle,
}: HexPatternFieldsProps) {
  return (
    <>
      <div>
        <label className={LABEL_CLASS}>Match Type</label>
        <div className="flex gap-2">
          {Object.values(HexMatchType).map((mt) => (
            <ToggleButton
              key={mt}
              selected={hexMatchType === mt}
              onClick={() => onHexMatchTypeChange(mt)}
              className="flex-1"
            >
              {mt === HexMatchType.DELTA_E
                ? "Delta E"
                : mt.charAt(0).toUpperCase() + mt.slice(1)}
            </ToggleButton>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL_CLASS}>Hex Value</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={hexValue}
            onChange={(e) => onHexValueChange(sanitizeHexInput(e.target.value))}
            placeholder="FFFFFF"
            className={`flex-1 ${INPUT_CLASS} uppercase`}
            maxLength={HEX_LENGTH}
            required
          />
          {isValidHex(hexValue) && (
            <span
              className="w-8 h-8 rounded border border-[#444]"
              style={{ backgroundColor: `#${hexValue}` }}
            />
          )}
        </div>
      </div>

      {hexMatchType === HexMatchType.DELTA_E && (
        <div>
          <label className={LABEL_CLASS}>Max Delta E</label>
          <input
            type="number"
            value={maxDeltaE}
            onChange={(e) => onMaxDeltaEChange(e.target.value)}
            placeholder="e.g. 5"
            className={`w-full ${INPUT_CLASS}`}
            step="0.1"
            min="0"
          />
        </div>
      )}

      <div>
        <label className={LABEL_CLASS}>
          Piece Types {!hexAnyPiece && `(${hexPieceTypes.length} selected)`}
        </label>
        <HexPieceSelector
          selectedPieces={hexPieceTypes}
          anySelected={hexAnyPiece}
          onToggle={onHexPieceToggle}
          onToggleAny={onHexAnyToggle}
        />
      </div>
    </>
  );
}
