import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { disallowPaths } from "@/lib/routeConfig";

function getHost(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return undefined;
  }
}

export default function robots(): MetadataRoute.Robots {
  const host = getHost(siteConfig.url);
  const isProduction = !siteConfig.url.includes("localhost");

  return {
    ...(host && isProduction && { host }),
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
