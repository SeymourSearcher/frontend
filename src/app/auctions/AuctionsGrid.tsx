import type { ActiveAuction, EndedAuction } from "@/types/auction";
import AuctionCard from "./AuctionCard";

interface AuctionsGridProps {
  auctions: (ActiveAuction | EndedAuction)[];
  isEnded?: boolean;
}

export default function AuctionsGrid({ auctions, isEnded = false }: AuctionsGridProps) {
  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#666] text-[14px]">No auctions found</p>
        <p className="text-[#555] text-[11px] mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {auctions.map((auction) => (
        <AuctionCard key={auction.auction_id} auction={auction} isEnded={isEnded} />
      ))}
    </div>
  );
}
