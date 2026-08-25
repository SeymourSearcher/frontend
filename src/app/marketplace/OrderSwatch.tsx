interface OrderSwatchProps {
  hexValue?: string;
  isSetPiece: boolean;
}

export default function OrderSwatch({ hexValue, isSetPiece }: OrderSwatchProps) {
  return (
    <div
      className="w-12 h-12 rounded-md shrink-0 flex items-center justify-center"
      style={{ backgroundColor: hexValue ? `#${hexValue}` : "#2a2a2a" }}
    >
      {isSetPiece && <span className="text-purple-300 text-[10px] font-bold">SET</span>}
    </div>
  );
}
