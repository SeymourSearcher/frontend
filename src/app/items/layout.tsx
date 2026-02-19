import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.items;

export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
