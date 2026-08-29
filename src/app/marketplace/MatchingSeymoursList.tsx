import { MatchingSeymour } from "@/types/marketplace";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { MinecraftItem } from "@/components/ui/MinecraftItem";

export default function MatchingSeymoursList({ seymours }: { seymours: MatchingSeymour[] }) {
  return (
    <div className="border-t border-[#333] mt-3 pt-3">
      <span className="text-[#888] text-[9px]">Your matching Seymours:</span>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {seymours.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-1 bg-[#252525] px-1.5 py-0.5 rounded text-[9px]"
          >
            <MinecraftItem piece={s.item_name} hex={s.hex_color} scale={1} slot={false} />
            <span className="text-[#ccc]">{PIECE_SLOT_NAMES[s.item_name]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
