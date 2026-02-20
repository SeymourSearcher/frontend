import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Seymour Searcher",
  description:
    "The Seymour Cafe tool for collecting Seymour's Special Armor on Hypixel Skyblock. Search colored armor pieces from the Garden visitor by hex code. Join our Discord community.",
  url: BASE_URL,
  ogImage: "/seymourcafe-logo.webp",
  keywords: [
    "Hypixel Skyblock Seymour",
    "Seymour Hypixel Skyblock",
    "Seymour armor Hypixel",
    "Seymour's Special Armor",
    "Seymour Cafe",
    "Seymour Cafe Discord",
    "Seymour Cafe Hypixel Skyblock Discord",
    "Seymour Garden",
    "Seymour Garden Hypixel Skyblock",
    "Seymour collecting",
    "Seymour armor collecting",
    "Hypixel Skyblock armor collecting",
    "Skyblock Seymour",
    "Skyblock armor",
    "Seymour Rift",
    "Velvet Top Hat",
    "Cashmere Jacket",
    "Satin Trousers",
    "Oxford Shoes",
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
    title: fullTitle,
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
      "Seymour Cafe - the Hypixel Skyblock tool for collecting Seymour armor. Find colored armor pieces from the Garden visitor with hex filtering. Join our Discord community.",
  }),
  marketplace: createMetadata({
    title: "Marketplace",
    description:
      "Buy and sell Seymour armor on Hypixel Skyblock. The Seymour Cafe marketplace for collecting Velvet Top Hats, Cashmere Jackets, Satin Trousers, and Oxford Shoes.",
    path: "/marketplace",
  }),
  items: createMetadata({
    title: "My Seymours",
    description:
      "Manage your Seymour armor collection on Hypixel Skyblock. Track your Garden pieces, filter by tier and color.",
    path: "/items",
    noIndex: true,
  }),
  ranking: createMetadata({
    title: "Rankings",
    description:
      "Top Seymour armor collectors on Hypixel Skyblock. See who's collecting the most Garden pieces ranked by tiers and complete sets.",
    path: "/ranking",
  }),
  faq: createMetadata({
    title: "FAQ",
    description:
      "Learn about Seymour armor collecting on Hypixel Skyblock. How to get pieces from the Garden visitor, hex codes, tiers, and join the Seymour Cafe Discord.",
    path: "/faq",
  }),
};

export function createHexPageMetadata(hexcode: string): Metadata {
  return createMetadata({
    title: `#${hexcode} Seymour Armor`,
    description: `Find Seymour armor on Hypixel Skyblock matching #${hexcode}. Seymour Cafe hex search for Garden armor collecting with Delta E matching.`,
    path: `/hex/${hexcode}`,
  });
}
