import { Metadata } from "next";
import { createHexPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ hexcode: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hexcode } = await params;
  return createHexPageMetadata(hexcode.toUpperCase());
}

export default function HexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
