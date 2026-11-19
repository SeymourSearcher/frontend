import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { isValidHex } from "@/lib/hex";
import { createHexPageMetadata, isHexIndexable } from "@/lib/seo";
import { getHexAuctionStats, getHexInfo, getHexOwners, getHexSales } from "@/lib/serverFetch";
import { HexPageClient } from "./HexPageClient";

type Props = {
  params: Promise<{ hexcode: string }>;
};

async function resolveHex(params: Props["params"]): Promise<{ raw: string; hex: string }> {
  const { hexcode: raw } = await params;
  const hex = raw.toUpperCase();
  if (!isValidHex(hex)) notFound();
  return { raw, hex };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hex } = await resolveHex(params);
  const info = await getHexInfo(hex);
  // Skipped for catalog colours, which are indexable regardless of owners.
  const owners = info?.exact_match ? null : await getHexOwners(hex);
  return createHexPageMetadata(hex, info, isHexIndexable(info, owners));
}

export default async function HexPage({ params }: Props) {
  const { raw, hex } = await resolveHex(params);
  if (raw !== hex) permanentRedirect(`/hex/${hex}`);

  // Each is null when the API is unreachable; the client island then fetches it itself.
  const [info, stats, sales] = await Promise.all([
    getHexInfo(hex),
    getHexAuctionStats(hex),
    getHexSales(hex),
  ]);

  // Keyed so navigating between hexes drops filter and page state with the old one.
  return (
    <HexPageClient
      key={hex}
      hexcode={hex}
      initialInfo={info}
      initialStats={stats}
      initialSales={sales}
    />
  );
}
