import Link from "next/link";

import { PIECE_INDEXES, PIECE_ITEM_NAMES, type PieceIndex, piecePath, pieceSlotLabel } from "@/lib/pieces";
import { LINK_CLASS, PieceSection } from "./PieceSection";

export function PieceLinks({ current }: { current: PieceIndex }) {
  return (
    <PieceSection title="Other Seymour pieces">
      <ul className="flex flex-col gap-1 text-[12px]">
        {PIECE_INDEXES.filter((piece) => piece !== current).map((piece) => (
          <li key={piece}>
            <Link href={piecePath(piece)} className={LINK_CLASS}>
              {PIECE_ITEM_NAMES[piece]}
            </Link>
            <span className="text-[#666]">, {pieceSlotLabel(piece)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] text-[#888]">
        <Link href="/auctions" className={LINK_CLASS}>
          Browse all Seymour auctions
        </Link>
        {" · "}
        <Link href="/faq" className={LINK_CLASS}>
          Seymour armor FAQ
        </Link>
      </p>
    </PieceSection>
  );
}
