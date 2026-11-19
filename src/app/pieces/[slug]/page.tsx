import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { ActiveAuctionListResponse, EndedAuctionListResponse } from "@/types/auction";
import { PIECE_ITEM_NAMES, pieceForSlug, piecePath, pieceSlotLabel } from "@/lib/pieces";
import { createPiecePageMetadata } from "@/lib/seo";
import { getJson, getPieceStats, PIECE_REVALIDATE_SECONDS } from "@/lib/serverFetch";
import StatsSummary from "@/components/auctions/StatsSummary";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AuctionLinkList } from "@/components/pieces/AuctionLinkList";
import { PieceIntro } from "@/components/pieces/PieceIntro";
import { PieceLinks } from "@/components/pieces/PieceLinks";
import { PieceSection } from "@/components/pieces/PieceSection";

// Must be a literal for Next; keep in step with PIECE_REVALIDATE_SECONDS.
export const revalidate = 600;

type Props = {
  params: Promise<{ slug: string }>;
};

// Empty on purpose: the build can't reach the API, so prerendered pages would ship
// without market data. Each page renders on its first request, then caches.
export function generateStaticParams() {
  return [];
}

async function resolvePiece(params: Props["params"]) {
  const piece = pieceForSlug((await params).slug);
  if (piece === null) notFound();
  return piece;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const piece = await resolvePiece(params);
  return createPiecePageMetadata(piece, await getPieceStats(piece));
}

export default async function PiecePage({ params }: Props) {
  const piece = await resolvePiece(params);
  const name = PIECE_ITEM_NAMES[piece];

  const [stats, active, ended] = await Promise.all([
    getPieceStats(piece),
    getJson<ActiveAuctionListResponse>(
      `/auctions/active?pieces=${piece}&sort_by=price&sort_order=asc&limit=10`,
      PIECE_REVALIDATE_SECONDS
    ),
    getJson<EndedAuctionListResponse>(
      `/auctions/ended?pieces=${piece}&sort_by=price&sort_order=desc&limit=5`,
      PIECE_REVALIDATE_SECONDS
    ),
  ]);

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-6 sm:p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name, path: piecePath(piece) },
        ]}
      />
      <div className="max-w-[900px] mx-auto">
        <h1 className="text-[1.5em] text-[#f0f0f0] mb-4">
          {name}: {pieceSlotLabel(piece)} in Hypixel SkyBlock
        </h1>

        <PieceIntro piece={piece} />

        {stats && stats.total > 0 && (
          <PieceSection
            title={`${name} market`}
            note={`Every ${name} sale recorded on the auction house. Tiers count sales by ΔE to their closest target colour.`}
          >
            <StatsSummary stats={stats} />
          </PieceSection>
        )}

        {active && (
          <PieceSection
            title={`Cheapest ${name} listings`}
            note="Live auctions and BIN listings, lowest price first."
          >
            <AuctionLinkList auctions={active.auctions} emptyMessage="No live listings right now" />
          </PieceSection>
        )}

        {ended && (
          <PieceSection
            title={`Highest ${name} sales`}
            note="The most expensive sales recorded, across all time."
          >
            <AuctionLinkList auctions={ended.auctions} emptyMessage="No sales recorded yet" />
          </PieceSection>
        )}

        <PieceLinks current={piece} />
      </div>
    </main>
  );
}
