import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const siteConfig = {
  name: "Seymour Searcher",
  description: "Search and discover Seymours with advanced filtering and statistics. Find your perfect Seymour match.",
  url: BASE_URL,
  ogImage: "/seymourcafe-logo.webp",
  keywords: ["Seymour", "Seymour Cafe", "Seymour Armor", "hex search", "color matching", "Skyblock", "collector"],
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
    description: "Search and discover Seymours with advanced filtering and statistics. Find your perfect Seymour match.",
  }),
  marketplace: createMetadata({
    title: "Marketplace",
    description: "Buy and sell Seymour pieces. Browse listings, create buy orders, and find the perfect pieces for your collection.",
    path: "/marketplace",
  }),
  items: createMetadata({
    title: "My Seymours",
    description: "View and manage your Seymour collection. Filter by tier, set, and more.",
    path: "/items",
    noIndex: true,
  }),
  ranking: createMetadata({
    title: "Rankings",
    description: "See the top Seymour collectors ranked by total pieces, tiers, sets, and more.",
    path: "/ranking",
  }),
  faq: createMetadata({
    title: "FAQ",
    description: "Learn everything about Seymour Armor - hex codes, tiers, Delta E, and how to collect.",
    path: "/faq",
  }),
};

export function createHexPageMetadata(hexcode: string): Metadata {
  return createMetadata({
    title: `#${hexcode} Hex Search`,
    description: `Find Seymour pieces matching hex color #${hexcode}. See closest matches, Delta E values, and available pieces.`,
    path: `/hex/${hexcode}`,
  });
}
