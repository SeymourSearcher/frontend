import Link from "next/link";

import { PIECE_ITEM_NAMES, PIECE_SLOT_NAMES, type PieceIndex } from "@/lib/pieces";
import { LINK_CLASS } from "./PieceSection";

// Facts only from src/app/faq/faqData.tsx; don't add game claims here that the FAQ doesn't make.
export function PieceIntro({ piece }: { piece: PieceIndex }) {
  const name = PIECE_ITEM_NAMES[piece];
  const others = PIECE_ITEM_NAMES.filter((other) => other !== name);

  return (
    <div className="text-[#ccc] text-[13px] leading-relaxed space-y-3">
      <p>
        The {name} is the {PIECE_SLOT_NAMES[piece].toLowerCase()} piece of Seymour armor in
        Hypixel SkyBlock, alongside the {others[0]}, {others[1]} and {others[2]}. Every piece
        spawns with a randomly generated hex colour, one of 16,777,216 possible codes.
      </p>
      <p>
        Pieces come from Seymour, a visitor in the Garden who has a rare chance to show up as a
        guest; you must talk to him first to possibly receive one. With so many possible hexes,
        most collectors buy pieces on the auction house instead.
      </p>
      <p>
        A piece&apos;s tier depends on its Delta E (ΔE) to a target colour: Tier 1 below 2, Tier 2
        from 2 to 5 and Tier 3 from 5 to 10. See the{" "}
        <Link href="/faq" className={LINK_CLASS}>
          FAQ
        </Link>{" "}
        for how hex codes and tiers work.
      </p>
    </div>
  );
}
