import Link from "next/link";
import { HexSearchInput } from "@/components/HexSearchInput";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] p-6 text-center">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-3">Page not found</h1>
      <p className="text-[#888] text-[12px] mb-6">
        Nothing lives here. Hex pages take a six-digit code, like /hex/FF00FF.
      </p>
      <div className="mb-6">
        <HexSearchInput showHint={false} colorizeInput />
      </div>
      <Link href="/" className="text-[#5865F2] text-[12px] no-underline hover:underline">
        ← Back home
      </Link>
    </div>
  );
}
