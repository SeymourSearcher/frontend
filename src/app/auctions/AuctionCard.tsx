"use client";

import Link from "next/link";
import type { ActiveAuction, EndedAuction } from "@/types/auction";
import { TIER_COLORS } from "./constants";
import { formatPrice, formatTimestamp, formatTimeUntil } from "@/lib/format";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import { ColorSwatch } from "@/components/ui/ColorSwatch";
import { MinecraftItem } from "@/components/ui/MinecraftItem";

interface AuctionCardProps {
  auction: ActiveAuction | EndedAuction;
  isEnded?: boolean;
}

function TierBadge({ tier }: { tier: string }) {
  const color = TIER_COLORS[tier] || "#666";
  return (
    <span
      className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase"
      style={{ backgroundColor: color, color: "#000" }}
    >
      {tier}
    </span>
  );
}

function BinBadge() {
  return (
    <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#5865F2] text-white font-bold">
      BIN
    </span>
  );
}

export default function AuctionCard({ auction, isEnded = false }: AuctionCardProps) {
  const activeAuction = auction as ActiveAuction;
  const endedAuction = auction as EndedAuction;

  return (
    <Link
      href={`/hex/${auction.hex_color}`}
      prefetch={false}
      className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] transition-colors flex flex-col h-full no-underline"
    >
      <div className="flex items-start gap-3 flex-1">
        <MinecraftItem piece={auction.piece} hex={auction.hex_color} scale={3} />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[12px] font-bold truncate"
              style={{ color: `#${auction.hex_color}` }}
            >
              #{auction.hex_color}
            </span>
            {auction.is_bin && <BinBadge />}
            {auction.tier && <TierBadge tier={auction.tier} />}
          </div>
          <span className="text-[#888] text-[10px]">{PIECE_SLOT_NAMES[auction.piece]}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <ColorSwatch hex={auction.target_hex} size="sm" />
            <span className="text-[9px] text-[#666]">
              <span style={{ color: `#${auction.target_hex}` }}>
                {auction.set_name || `#${auction.target_hex}`}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#333] mt-3 pt-3 flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <div className="text-[#4ade80] font-bold text-[13px]">
            {formatPrice(auction.price)}
          </div>
          <div className="text-[#666] text-[9px]">
            ΔE: {auction.delta_e.toFixed(1)} · Δ: {auction.abs_diff}
          </div>
        </div>

        <div className="flex flex-col items-end text-[9px] text-[#666]">
          {isEnded ? (
            <>
              <span>{formatTimestamp(endedAuction.timestamp)}</span>
              {(endedAuction.buyer_name || endedAuction.buyer_uuid) && (
                <span className="truncate max-w-[120px]">
                  Buyer: {endedAuction.buyer_name || endedAuction.buyer_uuid.slice(0, 15)}
                </span>
              )}
            </>
          ) : (
            <>
              {/* see SalesList's timestamp */}
              <span className="text-[#f0f0f0] font-medium" suppressHydrationWarning>
                {!activeAuction.end_time
                  ? "N/A"
                  : formatTimeUntil(activeAuction.end_time, "Ended")}
              </span>
              <span className="truncate max-w-[120px]">
                Seller: {activeAuction.seller_name || activeAuction.seller_uuid.slice(0, 15)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
