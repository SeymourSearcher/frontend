"use client";

import { useState } from "react";

/** Resolves to an error message, or null once the order is cancelled. */
export type CancelHandler = () => Promise<string | null>;

export default function CancelOrderButton({ onCancel }: { onCancel: CancelHandler }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    // Cards can sit inside a <Link>; don't navigate on cancel.
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    setError(null);
    const failure = await onCancel();
    setPending(false);
    setError(failure);
  }

  return (
    <span className="flex flex-col items-end gap-1 shrink-0">
      <button
        onClick={handleClick}
        disabled={pending}
        className="px-3 py-1.5 rounded text-[10px] bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-wait"
      >
        {pending ? "Cancelling..." : "Cancel"}
      </button>
      {error && (
        <span role="alert" className="text-[9px] text-red-400 max-w-[140px] text-right">
          {error}
        </span>
      )}
    </span>
  );
}
