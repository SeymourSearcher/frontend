import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Seymour Searcher",
  description:
    "Search and discover Seymour's Special Armor pieces on Hypixel Skyblock. Find colored Velvet Top Hats, Cashmere Jackets, Satin Trousers, and Oxford Shoes by hex code.",
  url: BASE_URL,
  ogImage: "/seymourcafe-logo.webp",
  keywords: [
    "Seymour Hypixel Skyblock",
    "Seymour's Special Armor Hypixel Skyblock",
    "Seymour Cafe Hypixel Skyblock",
    "Seymour Garden Hypixel Skyblock",
    "Seymour Rift",
    "Seymour Armor",
    "Seymour hex search",
    "Seymour color matching",
    "Hypixel Skyblock armor",
    "Velvet Top Hat",
    "Cashmere Jacket",
    "Satin Trousers",
    "Oxford Shoes",
    "Skyblock collector",
  ],
  author: "Seymour Searcher",
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
      "Search and discover Seymour's Special Armor on Hypixel Skyblock. Find colored armor pieces from Seymour the Garden visitor with advanced hex filtering and statistics.",
  }),
  marketplace: createMetadata({
    title: "Marketplace",
    description:
      "Buy and sell Seymour's Special Armor pieces on Hypixel Skyblock. Browse listings for Velvet Top Hats, Cashmere Jackets, Satin Trousers, and Oxford Shoes.",
    path: "/marketplace",
  }),
  items: createMetadata({
    title: "My Seymours",
    description: "View and manage your Seymour's Special Armor collection from Hypixel Skyblock. Filter by tier, color, and set.",
    path: "/items",
    noIndex: true,
  }),
  ranking: createMetadata({
    title: "Rankings",
    description:
      "See the top Seymour's Special Armor collectors on Hypixel Skyblock ranked by total pieces, tiers, and complete sets.",
    path: "/ranking",
  }),
  faq: createMetadata({
    title: "FAQ",
    description:
      "Learn about Seymour's Special Armor on Hypixel Skyblock - how to obtain pieces from Seymour in the Garden, hex codes, tiers, and Delta E color matching.",
    path: "/faq",
  }),
};

export function createHexPageMetadata(hexcode: string): Metadata {
  return createMetadata({
    title: `#${hexcode} Seymour Armor Search`,
    description: `Find Seymour's Special Armor pieces on Hypixel Skyblock matching hex color #${hexcode}. See closest matches, Delta E values, and available pieces.`,
    path: `/hex/${hexcode}`,
  });
}
