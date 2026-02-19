import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 512, height: 512, alt: `${siteConfig.name} Logo` }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: siteConfig.ogImage,
    apple: siteConfig.ogImage,
  },
  manifest: "/manifest.json",
  metadataBase: new URL(siteConfig.url),
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
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body>
        <Script src="/tt-policy.js" strategy="beforeInteractive" />
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
