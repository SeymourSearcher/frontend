import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { isValidHex } from "@/lib/hex";
import { createHexPageMetadata } from "@/lib/seo";
import { getHexInfo } from "@/lib/serverFetch";
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
  return createHexPageMetadata(hex, await getHexInfo(hex));
}

export default async function HexPage({ params }: Props) {
  const { raw, hex } = await resolveHex(params);
  if (raw !== hex) permanentRedirect(`/hex/${hex}`);

  // Null when the API is unreachable; the client island then fetches it itself.
  const info = await getHexInfo(hex);

  // Keyed so navigating between hexes drops filter and page state with the old one.
  return <HexPageClient key={hex} hexcode={hex} initialInfo={info} />;
}
