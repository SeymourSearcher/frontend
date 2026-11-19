import Link from "next/link";

import type { ActiveAuction, EndedAuction } from "@/types/auction";
import { formatPrice } from "@/lib/format";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TIER_CONFIG, tierForDeltaE } from "@/components/hex/tierConfig";

const ROW_CLASS =
  "flex items-center gap-3 px-3 h-11 rounded bg-[#1a1a1a] border border-[#2a2a2a] no-underline hover:bg-[#252525] transition-colors";

// No relative times ("3m ago"): this renders into ISR HTML that can be minutes old.
function AuctionLinkRow({ auction }: { auction: ActiveAuction | EndedAuction }) {
  const tier = tierForDeltaE(auction.delta_e);

  return (
    <li>
      <Link href={`/hex/${auction.hex_color}`} prefetch={false} className={ROW_CLASS}>
        <ColorSwatch hex={auction.hex_color} size="md" />
        <span className="text-[11px] font-bold w-[70px]" style={{ color: `#${auction.hex_color}` }}>
          #{auction.hex_color}
        </span>
        <span className="text-[11px] text-green-400 font-bold w-[60px]">
          {formatPrice(auction.price)}
        </span>
        <span className={`text-[10px] ${tier ? TIER_CONFIG[tier].color : "text-[#888]"}`}>
          ΔE {auction.delta_e.toFixed(1)}
        </span>
        {auction.is_bin && <span className="text-[9px] text-[#5865F2] font-bold">BIN</span>}
        <span className="text-[10px] text-[#666] ml-auto truncate">
          {auction.set_name ?? `#${auction.target_hex}`}
        </span>
      </Link>
    </li>
  );
}

interface AuctionLinkListProps {
  auctions: (ActiveAuction | EndedAuction)[];
  emptyMessage: string;
}

export function AuctionLinkList({ auctions, emptyMessage }: AuctionLinkListProps) {
  if (auctions.length === 0) return <StatusMessage>{emptyMessage}</StatusMessage>;

  return (
    <ul className="flex flex-col gap-1.5">
      {auctions.map((auction) => (
        <AuctionLinkRow key={auction.auction_id} auction={auction} />
      ))}
    </ul>
  );
}
