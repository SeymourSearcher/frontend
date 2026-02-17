import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Seymour Searcher",
    template: "%s | Seymour Searcher",
  },
  description: "Search and discover Seymours with advanced filtering and statistics. Find your perfect Seymour match.",
  keywords: ["Seymour", "Seymour Cafe", "search", "finder", "collector"],
  authors: [{ name: "Seymour Searcher" }],
  openGraph: {
    title: "Seymour Searcher",
    description: "Search and discover Seymours with advanced filtering and statistics.",
    url: "/",
    siteName: "Seymour Searcher",
    images: [{ url: "/seymourcafe-logo.webp", width: 512, height: 512, alt: "Seymour Searcher Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Seymour Searcher",
    description: "Search and discover Seymours with advanced filtering and statistics.",
    images: ["/seymourcafe-logo.webp"],
  },
  icons: {
    icon: "/seymourcafe-logo.webp",
    apple: "/seymourcafe-logo.webp",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/MinecraftSeven.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
