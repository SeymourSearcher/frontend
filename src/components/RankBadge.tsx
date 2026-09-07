const MEDAL_CLASSES: Record<number, string> = {
  1: "bg-yellow-500 text-black",
  2: "bg-gray-400 text-black",
  3: "bg-amber-700 text-white",
};

const SIZE_CLASSES = {
  sm: "w-6 h-6 text-[10px]",
  lg: "w-8 h-8 text-[12px]",
} as const;

interface RankBadgeProps {
  rank: number;
  size?: keyof typeof SIZE_CLASSES;
}

export function RankBadge({ rank, size = "sm" }: RankBadgeProps) {
  return (
    <span
      className={`${SIZE_CLASSES[size]} rounded-full flex items-center justify-center font-bold shrink-0 ${
        MEDAL_CLASSES[rank] ?? "bg-[#333] text-[#888]"
      }`}
    >
      {rank}
    </span>
  );
}
