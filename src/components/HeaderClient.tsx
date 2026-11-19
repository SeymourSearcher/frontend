"use client";

import { useState, lazy, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { HexSearchInput } from "./HexSearchInput";
import { UploadButton } from "./UploadButton";
import DiscordIcon from "./icons/DiscordIcon";

const LoginPromptModal = lazy(() =>
  import("./LoginPromptModal").then((mod) => ({ default: mod.LoginPromptModal }))
);

const NAV_LINKS = [
  { href: "/", label: "Home", external: false },
  { href: "/items", label: "Items", external: false },
  { href: "/auctions", label: "Auctions", external: false },
  { href: "/ranking", label: "Ranking", external: false },
  { href: "https://discord.gg/ecUT2vfaX5", label: "Discord", external: true },
  { href: "/faq", label: "FAQ", external: false },
];

const HEADER_SEARCH_INPUT_CLASS =
  "w-[110px] border border-[#333] bg-[#222] text-[#eee] text-[12px] px-2 py-1 rounded uppercase font-['MinecraftSeven',Arial,sans-serif] outline-none";
const HEADER_SEARCH_BUTTON_CLASS =
  "text-[#ccc] bg-[#333] border-none cursor-pointer text-[12px] px-2 py-1 rounded font-['MinecraftSeven',Arial,sans-serif]";

function HeaderSearch({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <HexSearchInput
      source="header"
      showHint={false}
      placeholder="hex"
      inputClassName={HEADER_SEARCH_INPUT_CLASS}
      buttonClassName={HEADER_SEARCH_BUTTON_CLASS}
      onNavigate={onNavigate}
    />
  );
}

export function HeaderClient() {
  const { user, loading, login, logout, sessionExpired, dismissSessionExpired } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  // The homepage hero already owns a search box; two on screen reads as a bug.
  const showSearch = usePathname() !== "/";

  function closeLoginPrompt() {
    setShowLoginPrompt(false);
    dismissSessionExpired();
  }

  return (
    <>
      <header className="flex items-center justify-between p-[6px] bg-[#1a1a1a] sticky top-0 z-[1000] font-['MinecraftSeven',Arial,sans-serif]">
        <button
          className="hidden max-[980px]:block bg-transparent border-none text-white cursor-pointer text-[28px] leading-none p-[4px_8px] mr-[10px] z-[1100]"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <nav className="flex gap-[15px] max-[980px]:hidden">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333]"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-4 max-[980px]:hidden">
          {showSearch && <HeaderSearch />}
          <UploadButton
            onRequireLogin={() => setShowLoginPrompt(true)}
            className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333] bg-transparent border-none cursor-pointer font-['MinecraftSeven',Arial,sans-serif]"
          />
          {!loading && (user ? (
            <>
              <span className="text-[#ccc] text-[14px]">{user.username}</span>
              <button
                onClick={logout}
                className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333] bg-transparent border-none cursor-pointer font-['MinecraftSeven',Arial,sans-serif]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded-[6px] transition-[background] duration-300 hover:bg-[#333] bg-transparent border-none cursor-pointer flex items-center gap-2 font-['MinecraftSeven',Arial,sans-serif]"
            >
              <DiscordIcon />
              Login
            </button>
          ))}
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/60 transition-opacity duration-300 z-[100] ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-[250px] bg-[#1a1a1a] p-5 shadow-[2px_0_5px_rgba(0,0,0,0.5)] transition-transform duration-300 z-[200] flex flex-col font-['MinecraftSeven',Arial,sans-serif] ${
          menuOpen ? "translate-x-0 translate-y-[6%]" : "-translate-x-full"
        }`}
      >
        {showSearch && (
          <div className="mb-3">
            <HeaderSearch onNavigate={() => setMenuOpen(false)} />
          </div>
        )}

        {NAV_LINKS.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              className="block text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded hover:bg-[#333]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="block text-[#ccc] no-underline text-[14px] p-[6px_10px] rounded hover:bg-[#333]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          )
        )}

        <div className="mt-auto mb-[65px] flex flex-col items-start">
          <UploadButton
            onRequireLogin={() => {
              setShowLoginPrompt(true);
              setMenuOpen(false);
            }}
            className="block w-full text-left text-[#ccc] text-[14px] p-[6px_10px] rounded hover:bg-[#333] bg-transparent border-none cursor-pointer font-['MinecraftSeven',Arial,sans-serif]"
          />
          {!loading && (user ? (
            <>
              <span className="block text-[#ccc] text-[14px] p-[6px_10px]">{user.username}</span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-[#ccc] text-[14px] p-[6px_10px] rounded hover:bg-[#333] bg-transparent border-none cursor-pointer font-['MinecraftSeven',Arial,sans-serif]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                login();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left text-[#ccc] text-[14px] p-[6px_10px] rounded hover:bg-[#333] bg-transparent border-none cursor-pointer font-['MinecraftSeven',Arial,sans-serif]"
            >
              <DiscordIcon />
              Login
            </button>
          ))}
        </div>
      </aside>

      {(showLoginPrompt || sessionExpired) && (
        <Suspense fallback={null}>
          <LoginPromptModal
            onClose={closeLoginPrompt}
            message={sessionExpired ? "Your session expired. Log in again to continue." : undefined}
          />
        </Suspense>
      )}
    </>
  );
}
