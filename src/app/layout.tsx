import type { Metadata } from "next";
import "./globals.css";
import { HeaderClient } from "@/components/HeaderClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { CollectionVersionProvider } from "@/contexts/CollectionVersionContext";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
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
        <AuthProvider>
          <CollectionVersionProvider>
            <HeaderClient />
            <main>{children}</main>
          </CollectionVersionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
