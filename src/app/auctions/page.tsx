import { connection } from "next/server";
import { getActiveAuctions, getAuctionSets } from "@/lib/serverFetch";
import AuctionsPageClient from "./AuctionsPageClient";
import { DEFAULT_ACTIVE_FILTERS } from "./constants";

export default async function AuctionsPage() {
  // Per request rather than ISR: cards render time-left against the clock, which a cached page would freeze.
  await connection();

  const [active, sets] = await Promise.all([
    getActiveAuctions(DEFAULT_ACTIVE_FILTERS),
    getAuctionSets(),
  ]);

  return <AuctionsPageClient initialActive={active} initialSets={sets} />;
}
