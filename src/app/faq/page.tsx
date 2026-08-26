"use client";

import { useState } from "react";
import { FAQ_DATA, type FAQItem } from "./faqData";

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left text-[#f0f0f0] text-[14px] bg-transparent border-none cursor-pointer hover:bg-[#252525] transition-colors font-['MinecraftSeven',Arial,sans-serif]"
      >
        <span>{item.question}</span>
        <span className={`text-[#5865F2] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 text-[#ccc] text-[13px] leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function handleToggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <main className="min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-[1.5em] text-[#f0f0f0] mb-2 text-center">FAQ</h1>
        <p className="text-[#888] text-[12px] text-center mb-8">
          Everything you need to know about Seymour Armor
        </p>

        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        <div className="mt-10 p-4 bg-[#1a1a1a] rounded-lg text-center">
          <p className="text-[#888] text-[12px]">
            Good luck and most importantly have fun collecting!
          </p>
        </div>
      </div>
    </main>
  );
}
