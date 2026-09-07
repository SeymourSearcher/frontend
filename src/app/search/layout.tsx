import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pattern Search",
  description:
    "Search Seymour armor colours by hex pattern — fix some digits, wildcard the rest, or bind digits to repeat.",
  path: "/search",
  // ~2.8e9 patterns, each a real request with nothing cached behind it.
  noIndex: true,
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  // Required: the page reads the pattern from useSearchParams.
  return <Suspense fallback={null}>{children}</Suspense>;
}
