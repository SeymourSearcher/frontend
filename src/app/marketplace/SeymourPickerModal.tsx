"use client";

interface SeymourPickerModalProps {
  onClose: () => void;
}

export function SeymourPickerModal({ onClose }: SeymourPickerModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#f0f0f0] mb-4">
          To create sell orders, go to the Items page and use the &quot;Sell&quot; button to
          select seymours.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/items"
            className="px-4 py-2 rounded text-[12px] bg-[#4ade80] text-[#121212] border-none cursor-pointer hover:bg-[#22c55e] transition-colors font-bold no-underline"
          >
            Go to Items
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-[12px] bg-[#333] text-[#ccc] border-none cursor-pointer hover:bg-[#444] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
