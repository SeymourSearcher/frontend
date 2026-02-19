"use client";

interface SellActionBarProps {
  selectedCount: number;
  price: string;
  onPriceChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onClear: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function SellActionBar({
  selectedCount,
  price,
  onPriceChange,
  onSubmit,
  onCancel,
  onClear,
  isSubmitting,
  error,
}: SellActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333] p-4 z-50">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[#ccc] text-[14px]">
            {selectedCount} selected
          </span>
          {selectedCount > 0 && (
            <button
              onClick={onClear}
              className="text-[#888] text-[12px] hover:text-[#ccc] transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {error && <span className="text-[#ff6b6b] text-[12px]">{error}</span>}

          <div className="flex items-center gap-2">
            <label className="text-[#888] text-[12px]">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="Enter price"
              min="1"
              className="bg-[#222] text-[#ccc] border border-[#444] rounded px-3 py-1.5 text-[12px] w-[120px]"
            />
            <span className="text-[#888] text-[12px]">coins</span>
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting || selectedCount === 0}
            className="bg-[#4ade80] text-[#121212] px-4 py-1.5 rounded text-[12px] font-bold hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Listing..." : "List for Sale"}
          </button>

          <button
            onClick={onCancel}
            className="bg-[#333] text-[#ccc] px-4 py-1.5 rounded text-[12px] hover:bg-[#444] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
