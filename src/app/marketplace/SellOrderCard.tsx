"use client";

import Link from "next/link";
import { SellOrder, OrderStatus } from "@/types/marketplace";
import { PIECE_NAMES, formatTimeRemaining } from "./constants";

interface SellOrderCardProps {
  order: SellOrder;
  isOwn?: boolean;
  onCancel?: () => void;
}

function getDiscordDmUrl(discordId: number): string {
  return `https://discord.com/users/${discordId}`;
}

export default function SellOrderCard({ order, isOwn, onCancel }: SellOrderCardProps) {
  const { seymour } = order;
  const isActive = order.status === OrderStatus.ACTIVE;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] transition-colors relative">
      {isOwn && !isActive && (
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold ${
            order.status === OrderStatus.CANCELLED
              ? "bg-red-600/30 text-red-300"
              : "bg-yellow-600/30 text-yellow-300"
          }`}
        >
          {order.status}
        </span>
      )}

      <Link href={`/hex/${seymour.hex_color}`} className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-md shrink-0"
          style={{ backgroundColor: `#${seymour.hex_color}` }}
        />
        <div className="flex flex-col min-w-0">
          <span
            className="text-[12px] font-bold truncate"
            style={{ color: `#${seymour.hex_color}` }}
          >
            #{seymour.hex_color}
          </span>
          <span className="text-[#888] text-[10px]">
            {PIECE_NAMES[seymour.item_name]}
          </span>
          {seymour.match && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#5865F2] text-[9px] truncate">{seymour.match.target_name}</span>
              <span className="text-[#666] text-[9px] shrink-0">ΔE: {seymour.match.delta_e}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="border-t border-[#333] mt-3 pt-3 flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <div className="text-[#4ade80] font-bold text-[13px]">
            {order.price.toLocaleString()} coins
          </div>
          <div className="text-[#666] text-[9px]">
            {formatTimeRemaining(order.expires_at)}
          </div>
        </div>

        {!isOwn && order.user && (
          <a
            href={getDiscordDmUrl(order.user.discord_id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-[#888] hover:text-[#5865F2] transition-colors shrink-0"
          >
            {order.user.avatar_hash ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${order.user.discord_id}/${order.user.avatar_hash}.png?size=32`}
                alt=""
                className="w-4 h-4 rounded-full"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-[#5865F2]" />
            )}
            <span className="truncate max-w-[60px]">{order.user.username}</span>
          </a>
        )}

        {isOwn && isActive && onCancel && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="px-3 py-1.5 rounded text-[10px] bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors border-none cursor-pointer shrink-0"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
