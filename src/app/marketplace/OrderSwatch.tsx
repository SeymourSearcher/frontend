import { HexCriteria } from "@/types/marketplace";
import { MinecraftItem } from "@/components/ui/MinecraftItem";

interface OrderSwatchProps {
  hexCriteria?: HexCriteria | null;
  isSetPiece: boolean;
}

export default function OrderSwatch({ hexCriteria, isSetPiece }: OrderSwatchProps) {
  // A hex order naming one piece describes an item, so it gets the sprite; "any piece" is just a colour.
  if (!isSetPiece && hexCriteria && hexCriteria.piece_type !== null) {
    return (
      <MinecraftItem piece={hexCriteria.piece_type} hex={hexCriteria.hex_value} scale={3} />
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-md shrink-0 flex items-center justify-center"
      style={{ backgroundColor: hexCriteria ? `#${hexCriteria.hex_value}` : "#2a2a2a" }}
    >
      {isSetPiece && <span className="text-purple-300 text-[10px] font-bold">SET</span>}
    </div>
  );
}
