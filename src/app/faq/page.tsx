"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is Seymour Armor?",
    answer: (
      <>
        <p>
          Seymour pieces spawn with a randomly generated hex code (color). There are 4 pieces:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Velvet Top Hat</li>
          <li>Cashmere Jacket</li>
          <li>Satin Trousers</li>
          <li>Oxford Shoes</li>
        </ul>
      </>
    ),
  },
  {
    question: "How rare are Seymour pieces?",
    answer: (
      <p>
        There are <span className="text-[#5865F2] font-bold">16,777,216</span> possible hex codes, 
        making specific hexes like <span className="text-[#993333]">#993333</span> (default pure red) 
        or <span className="text-[#CC5500]">#CC5500</span> (Farmer boot hex) incredibly rare. 
        These pieces can sell for upwards of 1B+ coins to the right buyer, depending on current market conditions.
      </p>
    ),
  },
  {
    question: "How do I obtain Seymour pieces?",
    answer: (
      <>
        <p>
          Tuxedo pieces can be obtained from Seymour the visitor, located in the garden. 
          He has a rare chance to show up as a guest, and you must talk to him first to possibly receive a piece.
        </p>
        <p className="mt-3">
          If you&apos;re interested in collecting, it&apos;s best to buy pieces off the auction house or in bulk from different sellers. 
          With the number of possible hexes, obtaining matching pieces or unique hexes yourself is quite challenging.
        </p>
      </>
    ),
  },
  {
    question: "How do HEX codes work?",
    answer: (
      <>
        <p>
          Hex color codes are six letters and/or numbers. The first two refer to <span className="text-red-500">red</span>, 
          the next two refer to <span className="text-green-500">green</span>, and the last two refer to <span className="text-blue-500">blue</span>.
        </p>
        <p className="mt-3">
          Color values range from 0 (darkest) to F (lightest). <span className="font-mono bg-[#333] px-1 rounded">#000000</span> is 
          true black and <span className="font-mono bg-[#333] px-1 rounded">#FFFFFF</span> is pure white.
        </p>
        <p className="mt-3">
          The first digit in each pair (R_G_B_) has the largest effect on the overall color. 
          For example, <span className="font-mono bg-[#333] px-1 rounded">#999999</span> and <span className="font-mono bg-[#333] px-1 rounded">#959595</span> look 
          nearly identical (only second digits differ), but <span className="font-mono bg-[#333] px-1 rounded">#D9D9D9</span> is vastly different.
        </p>
        <p className="mt-3 text-[#888]">
          When you see someone use x&apos;s as placeholders (like 1x9xBx), they need a piece with matching first digits since the second digits have less effect.
        </p>
      </>
    ),
  },
  {
    question: "How do I view HEX codes in-game?",
    answer: (
      <>
        <p>
          Press <span className="font-mono bg-[#333] px-2 py-0.5 rounded">F3+H</span> simultaneously to enable advanced tooltips. 
          When hovering over any dyed leather piece, it will show you the HEX code.
        </p>
        <p className="mt-3 text-[#f59e0b]">
          Note: As of February 24th, 2026, you cannot use versions earlier than 1.21.9 for this. 
          F3+H does NOT work on latest versions—you must use external mods like &quot;SeymourAnalyzer&quot;.
        </p>
      </>
    ),
  },
  {
    question: "What colors are most desirable?",
    answer: (
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-black border border-[#444] inline-block" /> 
          <span><strong>Black</strong> — True black, not very dark green or blue</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white inline-block" /> 
          <span><strong>White</strong> — True white, same situation as black</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-500 inline-block" /> 
          <span><strong>Shades of Grey</strong></span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#800000] inline-block" /> 
          <span><strong>Darker colors</strong> — Maroon, cyan, etc.</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-pink-300 inline-block" /> 
          <span><strong>Pastel Shades</strong> — Lighter colors, usually with most/all letter values in the hex</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 inline-block" /> 
          <span><strong>Skyblock Dyes</strong> — Plus most/all Tier 1 armors</span>
        </li>
      </ul>
    ),
  },
  {
    question: "What are the piece tiers?",
    answer: (
      <>
        <div className="space-y-3">
          <div className="p-3 bg-[#252525] rounded-lg border-l-4 border-[#FF55FF]">
            <p className="font-bold text-[#FF55FF]">Tier 1 (0 - 1.999)</p>
            <p className="text-[#aaa] text-[12px] mt-1">
              Shouldn&apos;t be able to tell the difference with a side-by-side comparison to the original set.
            </p>
          </div>
          <div className="p-3 bg-[#252525] rounded-lg border-l-4 border-[#FFAA00]">
            <p className="font-bold text-[#FFAA00]">Tier 2 (2.0 - 4.999)</p>
            <p className="text-[#aaa] text-[12px] mt-1">
              Shouldn&apos;t be able to tell the difference without a side-by-side comparison to the original set.
            </p>
          </div>
          <div className="p-3 bg-[#252525] rounded-lg border-l-4 border-[#AAAAAA]">
            <p className="font-bold text-[#AAAAAA]">Tier 3 (5 - 9.999)</p>
            <p className="text-[#aaa] text-[12px] mt-1">
              Some of these could still look close but no point in listing most.
            </p>
          </div>
        </div>
        <p className="mt-4 text-[#888] text-[12px]">
          Note: Tier accuracy is color-dependent. Some 4.5&apos;s may look almost perfect with one color, while some 2&apos;s may not with another.
        </p>
      </>
    ),
  },
  {
    question: "What is Delta E (ΔE)?",
    answer: (
      <>
        <p>
          <span className="text-[#5865F2] font-bold">Delta E (ΔE)</span> is a scientific measure of how different two colors appear to the human eye. 
          It stands for &quot;Delta Empfindung&quot; (German for &quot;difference in sensation&quot;).
        </p>
        <p className="mt-3">
          Unlike simple RGB comparison, Delta E accounts for how humans actually perceive color differences. 
          A ΔE of <span className="font-mono bg-[#333] px-1 rounded">0</span> means the colors are identical, 
          while higher values indicate more noticeable differences.
        </p>
        <div className="mt-4 space-y-2 text-[12px]">
          <div className="flex items-center gap-3">
            <span className="w-16 text-right font-mono text-[#5865F2]">0 - 1</span>
            <span className="text-[#aaa]">Not perceptible by human eyes</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-right font-mono text-[#5865F2]">1 - 2</span>
            <span className="text-[#aaa]">Perceptible through close observation</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-right font-mono text-[#5865F2]">2 - 10</span>
            <span className="text-[#aaa]">Perceptible at a glance</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-right font-mono text-[#5865F2]">11 - 49</span>
            <span className="text-[#aaa]">Colors are more similar than opposite</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-right font-mono text-[#5865F2]">100</span>
            <span className="text-[#aaa]">Colors are exact opposites</span>
          </div>
        </div>
        <p className="mt-4 text-[#888] text-[12px]">
          This is what determines the tier of a Seymour piece when comparing to a target color. 
          This site uses the <span className="text-[#5865F2]">CIE76</span> formula for Delta E calculations.
        </p>
      </>
    ),
  },
  {
    question: "What is ABS (Absolute Difference)?",
    answer: (
      <>
        <p>
          <span className="text-[#5865F2] font-bold">ABS</span> (Absolute Difference) is a simpler way to measure how different two hex codes are 
          by calculating the total numerical difference between their RGB values.
        </p>
        <p className="mt-3">
          For each color channel (R, G, B), the absolute difference is calculated and summed together. 
          For example, comparing <span className="font-mono bg-[#333] px-1 rounded">#FF0000</span> to <span className="font-mono bg-[#333] px-1 rounded">#FE0102</span>:
        </p>
        <div className="mt-3 p-3 bg-[#252525] rounded-lg font-mono text-[12px]">
          <p>R: |255 - 254| = 1</p>
          <p>G: |0 - 1| = 1</p>
          <p>B: |0 - 2| = 2</p>
          <p className="mt-2 text-[#5865F2]">Total ABS = 4</p>
        </div>
        <p className="mt-4 text-[#888] text-[12px]">
          Lower ABS means the hex codes are numerically closer. However, ABS doesn&apos;t account for human color perception like Delta E does—two 
          colors with the same ABS can look very different depending on which channels differ.
        </p>
      </>
    ),
  },
];

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
