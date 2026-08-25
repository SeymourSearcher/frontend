"use client";

import type { RecentBid } from "@/lib/api";
import { formatPrice, formatTimestamp } from "@/lib/format";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";

function ColorSwatch({ hex }: { hex: string }) {
  return (
    <div
      className="w-5 h-5 rounded shrink-0"
      style={{ backgroundColor: `#${hex}` }}
    />
  );
}

function BidRow({ bid }: { bid: RecentBid }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-[#1f1f1f] transition-colors border-b border-[#2a2a2a] last:border-b-0">
      <ColorSwatch hex={bid.hex_color} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium" style={{ color: `#${bid.hex_color}` }}>
            #{bid.hex_color}
          </span>
          <span className="text-[10px] text-[#666]">{PIECE_SLOT_NAMES[bid.piece]}</span>
          {bid.set_name && (
            <span className="text-[9px] text-[#555]">• {bid.set_name}</span>
          )}
          <span className="text-[9px] text-[#555]">
            ΔE: {bid.delta_e.toFixed(1)} · Δ: {bid.abs_diff}
          </span>
        </div>
        <div className="text-[10px] text-[#888] mt-0.5">
          <span className="text-[#aaa]">{bid.bidder_name || bid.bidder_uuid.slice(0, 12)}</span>
          {" "}bid{" "}
          <span className="text-[#4ade80] font-medium">{formatPrice(bid.amount)}</span>
        </div>
      </div>
      
      <div className="text-[10px] text-[#555]">
        {formatTimestamp(bid.timestamp)}
      </div>
    </div>
  );
}

export default function RecentBidsFeed({ bids }: { bids: RecentBid[] }) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-12 text-[#666] text-[13px]">
        No recent bids found
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      {bids.map((bid, idx) => (
        <BidRow key={`${bid.auction_id}-${bid.timestamp}-${idx}`} bid={bid} />
      ))}
    </div>
  );
}
