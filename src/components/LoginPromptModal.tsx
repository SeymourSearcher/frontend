"use client";

interface LoginPromptModalProps {
  onClose: () => void;
}

export function LoginPromptModal({ onClose }: LoginPromptModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#f0f0f0] mb-4">
          You need to login to access this feature.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded text-[12px] bg-[#333] text-[#ccc] border-none cursor-pointer hover:bg-[#444] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
