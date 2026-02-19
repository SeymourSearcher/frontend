"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeaderClient = dynamic(
  () => import("./HeaderClient").then((mod) => mod.HeaderClient),
  {
    ssr: false,
    loading: () => <HeaderSkeleton />,
  }
);

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/ranking", label: "Ranking" },
  { href: "/faq", label: "FAQ" },
];

function HeaderSkeleton() {
  return (
    <header className="flex items-center justify-between p-[6px] bg-[#1a1a1a] sticky top-0 z-[1000] font-['MinecraftSeven',Arial,sans-serif]">
      <nav className="flex gap-[15px] max-[980px]:hidden">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333]"
          >
            {link.label}
          </Link>
        ))}
        <a
          href="https://discord.gg/ecUT2vfaX5"
          className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333]"
        >
          Discord
        </a>
      </nav>
      <div className="flex items-center gap-4 max-[980px]:hidden">
        <span className="text-[#ccc] text-[14px] p-[6px_10px]">Upload</span>
        <span className="text-[#ccc] text-[14px] p-[6px_10px]">Login</span>
      </div>
    </header>
  );
}

export default function Header() {
  return <HeaderClient />;
}
