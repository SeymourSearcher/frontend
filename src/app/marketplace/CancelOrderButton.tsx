"use client";

export default function CancelOrderButton({ onCancel }: { onCancel: () => void }) {
  return (
    <button
      onClick={(e) => {
        // Cards can sit inside a <Link>; don't navigate on cancel.
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      }}
      className="px-3 py-1.5 rounded text-[10px] bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors border-none cursor-pointer shrink-0"
    >
      Cancel
    </button>
  );
}
