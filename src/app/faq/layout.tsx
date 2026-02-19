import { pageMetadata } from "@/lib/seo";
import { FAQJsonLd } from "@/components/seo";
import { FAQ_DATA_PLAIN } from "./faqData";

export const metadata = pageMetadata.faq;

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQJsonLd items={FAQ_DATA_PLAIN} />
      {children}
    </>
  );
}
