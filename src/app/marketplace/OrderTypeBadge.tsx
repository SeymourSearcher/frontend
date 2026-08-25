export default function OrderTypeBadge({ isSetPiece }: { isSetPiece: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
        isSetPiece
          ? "bg-purple-600/30 text-purple-300"
          : "bg-blue-600/30 text-blue-300"
      }`}
    >
      {isSetPiece ? "Set Piece" : "Hex Pattern"}
    </span>
  );
}
