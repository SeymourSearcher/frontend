"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#121212] p-6 text-center">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-3">Something went wrong</h1>
      <p className="text-[#888] text-[12px] mb-6">
        This page hit an unexpected error. Try again, or head back home.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded text-[12px] bg-[#5865F2] text-white border-none cursor-pointer hover:bg-[#4752c4] transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded text-[12px] bg-[#333] text-[#ccc] no-underline hover:bg-[#444] transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
