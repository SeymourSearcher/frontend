import Link from "next/link";
import type { EndedAuction } from "@/types/auction";
import { MinecraftItem } from "@/components/ui/MinecraftItem";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { formatPrice } from "@/lib/format";

/** Below this the doubled track is narrower than the 900px column and the loop
 *  shows a gap, so the list repeats until it clears the bar. */
const MIN_CHIPS = 8;

/** 276px card + margin per this many seconds ≈ the wiki showcase's 55px/s. */
const SECONDS_PER_CHIP = 5;

function repeatToFill(sales: EndedAuction[]): EndedAuction[] {
  const copies = Math.ceil(MIN_CHIPS / sales.length);
  return Array.from({ length: copies }, () => sales).flat();
}

function SaleChip({ sale, hidden }: { sale: EndedAuction; hidden?: boolean }) {
  return (
    <Link
      href={`/hex/${sale.hex_color}`}
      prefetch={false}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      title={`${PIECE_SLOT_NAMES[sale.piece]} · #${sale.hex_color}${
        sale.set_name ? ` · ${sale.set_name}` : ""
      }`}
      // Margin rather than a flex gap on the track: -50% must land exactly on
      // the start of the second copy, and a gap leaves one fewer space than
      // items, so half the track falls mid-gap and the loop visibly jumps.
      className="flex items-start gap-3 shrink-0 w-[260px] mr-4 bg-[#1a1a1a] border border-[#2c2c2c] rounded-lg p-4 hover:border-[#555] hover:bg-[#1f1f1f] transition-colors"
    >
      <MinecraftItem piece={sale.piece} hex={sale.hex_color} scale={3} />
      <span className="flex flex-col min-w-0 flex-1">
        <span className="text-[13px] font-bold truncate" style={{ color: `#${sale.hex_color}` }}>
          #{sale.hex_color}
        </span>
        <span className="text-[12px] text-green-400">{formatPrice(sale.price)}</span>
        <span className="text-[11px] text-[#666] truncate mt-1">
          {sale.set_name ?? PIECE_SLOT_NAMES[sale.piece]}
        </span>
      </span>
    </Link>
  );
}

/** Today's highest sales, scrolling. Nothing here reads the clock: the section
 *  renders on the server, and a relative timestamp would not survive hydration. */
export function TopSalesTicker({ sales }: { sales: EndedAuction[] }) {
  if (sales.length === 0) return null;

  const track = repeatToFill(sales);
  const animationDuration = `${track.length * SECONDS_PER_CHIP}s`;

  return (
    // Clipped to the content column rather than full-bleed, so the cards read as
    // part of the page the way the wiki's showcase band does.
    <section className="mt-24 max-w-[900px] mx-auto px-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h2 className="text-[#f0f0f0] text-[14px] mb-1">Top Sales Today</h2>
      <p className="text-[#666] text-[11px] mb-4">
        The highest prices paid in the last 24 hours. Click a colour to look it up.
      </p>

      {/* .marquee pairs with .marquee-track in globals.css: hovering pauses. */}
      <div className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex w-max marquee-track" style={{ animationDuration }}>
          {/* Rendered twice: the second copy is what scrolls into view as the
              first leaves, and is hidden from assistive tech as a duplicate. */}
          {[...track, ...track].map((sale, i) => (
            <SaleChip
              key={`${sale.auction_id}-${i}`}
              sale={sale}
              hidden={i >= track.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
