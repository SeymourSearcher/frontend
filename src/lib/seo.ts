import { Metadata } from "next";

import { env } from "@/lib/env";
import { formatPrice } from "@/lib/format";
import type { HexInfo } from "@/types/hex";

const BASE_URL = env.frontendUrl;

export const siteConfig = {
  name: "Seymour Searcher",
  description:
    "The Seymour Cafe tool for collecting Seymour's Special Armor on Hypixel Skyblock. Search colored armor pieces from the Garden visitor by hex code. Join our Discord community.",
  url: BASE_URL,
  ogImage: "/seymourcafe-logo.webp",
  keywords: [
    "Where to find Seymour Hypixel Skyblock",
    "Seymour Hypixel Skyblock",
    "Hypixel Skyblock Seymour",
    "Seymour Hypixel Skyblock Garden",
    "Seymour armor Hypixel",
    "Seymours armor",
    "Seymour's Special Armor",
    "Seymour Cafe",
    "Seymour Cafe Discord",
    "Seymour Cafe Hypixel Skyblock Discord",
    "Seymour Garden",
    "Seymour Garden Hypixel Skyblock",
    "Velvet Top Hat Skyblock",
    "Velvet Top Hat",
    "Cashmere Jacket Skyblock",
    "Cashmere Jacket",
    "Satin Trousers Skyblock",
    "Satin Trousers",
    "Oxford Shoes Skyblock",
    "Oxford Shoes",
    "Seymour collecting",
    "Seymour armor collecting",
    "Hypixel Skyblock armor collecting",
    "Skyblock Seymour",
    "Skyblock armor",
    "Seymour Rift",
    "Seymour hex code",
    "Skyblock collector",
  ],
  author: "Seymour Cafe",
  twitterHandle: "@seymoursearcher",
};

export function createMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullDescription = description || siteConfig.description;
  const fullUrl = `${siteConfig.url}${path}`;
  const fullImage = image || siteConfig.ogImage;

  return {
    // absolute: fullTitle already has the suffix the root layout's template would add again.
    title: { absolute: fullTitle },
    description: fullDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author }],
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [{ url: fullImage, width: 512, height: 512, alt: siteConfig.name }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export const pageMetadata = {
  home: createMetadata({
    description:
      "Where to find Seymour on Hypixel Skyblock? Seymour Cafe helps you collect Seymours armor from the Garden visitor. Search Velvet Top Hats by hex code. Join our Discord.",
  }),
  marketplace: createMetadata({
    title: "Marketplace",
    description:
      "Buy and sell Seymours armor on Hypixel Skyblock. Seymour Cafe marketplace for Velvet Top Hat, Cashmere Jacket, Satin Trousers, and Oxford Shoes collecting.",
    path: "/marketplace",
  }),
  items: createMetadata({
    title: "My Seymours",
    description:
      "Manage your Seymours armor collection on Hypixel Skyblock. Track Garden pieces like Velvet Top Hats, filter by tier and hex color.",
    path: "/items",
    noIndex: true,
  }),
  ranking: createMetadata({
    title: "Rankings",
    description:
      "Top Seymours armor collectors on Hypixel Skyblock. Rankings for Garden armor collecting - Velvet Top Hats, Cashmere Jackets, and complete sets.",
    path: "/ranking",
  }),
  faq: createMetadata({
    title: "FAQ",
    description:
      "Where to find Seymour on Hypixel Skyblock? Learn about Seymours armor from the Garden, Velvet Top Hat hex codes, collecting tiers. Join Seymour Cafe Discord.",
    path: "/faq",
  }),
};

function describeHex(hexcode: string, info: HexInfo | null): string {
  const exact = info?.exact_match ?? null;
  const reference = exact ?? info?.top_matches[0] ?? null;
  if (!reference) {
    return `Find Seymours armor on Hypixel Skyblock matching #${hexcode}. Seymour Cafe search for Garden Velvet Top Hats and armor pieces by hex code.`;
  }

  const match = exact
    ? `#${hexcode} is an exact match for ${exact.target_name}.`
    : `#${hexcode} is ΔE ${reference.delta_e} from ${reference.target_name}, its closest catalog colour.`;
  const { median, sales } = reference.price;
  const price =
    median === null
      ? ""
      : ` Median sale ${formatPrice(median)} across ${sales} sale${sales === 1 ? "" : "s"}.`;
  return `${match}${price} Owners, recent auctions and close matches for this Seymour armor colour on Hypixel Skyblock.`;
}

/** `info` is the unfiltered hex lookup, or null when the API could not serve it. */
export function createHexPageMetadata(hexcode: string, info: HexInfo | null): Metadata {
  const exact = info?.exact_match;
  return createMetadata({
    title: exact ? `#${hexcode} ${exact.target_name}` : `#${hexcode} Seymour Armor`,
    description: describeHex(hexcode, info),
    path: `/hex/${hexcode}`,
  });
}
