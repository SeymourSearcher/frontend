"use client";

import { useAuth } from "@/contexts/AuthContext";
import DiscordIcon from "./icons/DiscordIcon";

interface LoginPromptModalProps {
  onClose: () => void;
  message?: string;
}

export function LoginPromptModal({
  onClose,
  message = "You need to login to access this feature.",
}: LoginPromptModalProps) {
  const { login } = useAuth();

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#f0f0f0] mb-4">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={login}
            className="px-4 py-2 rounded text-[12px] bg-[#5865F2] text-white border-none cursor-pointer hover:bg-[#4752c4] transition-colors flex items-center gap-2"
          >
            <DiscordIcon />
            Login
          </button>
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
