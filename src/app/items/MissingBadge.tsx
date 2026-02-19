interface MissingBadgeProps {
  pieces: string[];
}

export default function MissingBadge({ pieces }: MissingBadgeProps) {
  if (!pieces.length) return null;
  return (
    <span className="text-[9px] text-[#ff6b6b] bg-[#3a2020] px-2 py-0.5 rounded">
      Missing: {pieces.join(", ")}
    </span>
  );
}
