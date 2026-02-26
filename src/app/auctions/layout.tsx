import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auctions",
  description: "Browse active and ended Seymour armor auctions on Hypixel Skyblock",
};

export default function AuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
