import { pageMetadata } from "@/lib/seo";
import { FAQJsonLd } from "@/components/seo/JsonLd";
import { FAQ_DATA } from "./faqData";

export const metadata = pageMetadata.faq;

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQJsonLd items={FAQ_DATA.map(({ question, plain }) => ({ question, answer: plain }))} />
      {children}
    </>
  );
}
