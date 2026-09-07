"use client";

import { useState } from "react";
import { deleteAllSeymours, fetchMySellOrders } from "@/lib/api";
import type { SeymourRemoval } from "@/types/seymour";
import { OrderStatus } from "@/types/marketplace";

type Phase = "idle" | "confirming" | "working" | "done";

const PANEL = "max-w-[600px] mx-auto mt-10 border-t border-[#333] pt-5 text-center";
const BUTTON =
  "px-3 py-1 rounded text-[12px] cursor-pointer font-['MinecraftSeven',Arial,sans-serif] disabled:opacity-50 disabled:cursor-not-allowed";

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

/** Clears the uploaded collection — the counterpart to the header's Upload.
 *
 *  The account survives, so this is undone by uploading the file again. The one
 *  part that is not recoverable is the sell listings, which is why they are
 *  counted up front rather than mentioned afterwards.
 */
export function RemoveMyData({ total, onRemoved }: { total: number; onRemoved: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [listings, setListings] = useState<number | null>(null);
  const [result, setResult] = useState<SeymourRemoval | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openConfirmation() {
    setPhase("confirming");
    setError(null);
    // Only the count is wanted, so ask for the smallest page that carries one.
    const orders = await fetchMySellOrders({ status: OrderStatus.ACTIVE, limit: 1 });
    setListings(orders.ok ? orders.data.total : null);
  }

  async function remove() {
    setPhase("working");
    const response = await deleteAllSeymours();

    if (!response.ok) {
      setError(response.detail);
      setPhase("confirming");
      return;
    }

    setResult(response.data);
    setPhase("done");
    onRemoved();
  }

  if (phase === "done" && result) {
    return (
      <div className={PANEL}>
        <p className="text-[#4ade80] text-[12px]">
          Removed {plural(result.removed, "seymour")}
          {result.sell_orders_cancelled > 0 &&
            ` and cancelled ${plural(result.sell_orders_cancelled, "sell listing")}`}
          .
        </p>
        <p className="text-[#666] text-[11px] mt-1">
          Upload your export again whenever you want it back.
        </p>
      </div>
    );
  }

  // Checked after the result panel: onRemoved drops the count to zero, and
  // returning null on it would take the confirmation away with it.
  if (total === 0) return null;

  if (phase === "idle") {
    return (
      <div className={PANEL}>
        <button
          onClick={openConfirmation}
          className={`${BUTTON} px-5 py-2 text-[13px] bg-transparent border border-[#f87171] text-[#f87171] hover:bg-[#f87171] hover:text-[#121212]`}
        >
          Remove my data
        </button>
      </div>
    );
  }

  return (
    <div className={PANEL}>
      <h2 className="text-[#f87171] text-[13px] mb-2">Remove my data</h2>

      <p className="text-[#ccc] text-[12px]">
        Deletes all {plural(total, "seymour")} you uploaded
        {/* Null means the lookup failed -- warn without a number rather than
            imply there are none. */}
        {listings === null
          ? ", along with any active sell listings"
          : listings > 0 && ` and cancels ${plural(listings, "sell listing")}`}
        .
      </p>
      <p className="text-[#666] text-[11px] mt-1 mb-3">
        Your account stays, and you can upload the file again. Cancelled listings do not come back.
      </p>

      {error && <p className="text-[#f87171] text-[11px] mb-2">{error}</p>}

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPhase("idle")}
          disabled={phase === "working"}
          className={`${BUTTON} bg-[#333] text-[#ccc] hover:bg-[#444]`}
        >
          Cancel
        </button>
        <button
          onClick={remove}
          disabled={phase === "working"}
          className={`${BUTTON} bg-[#b91c1c] text-white hover:bg-[#dc2626]`}
        >
          {phase === "working" ? "Removing..." : "Remove everything"}
        </button>
      </div>
    </div>
  );
}
