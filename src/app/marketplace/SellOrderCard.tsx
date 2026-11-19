"use client";

import Link from "next/link";
import { SellOrder, OrderStatus } from "@/types/marketplace";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";
import CancelOrderButton, { type CancelHandler } from "./CancelOrderButton";
import DiscordUserLink from "./DiscordUserLink";
import OrderCardFooter from "./OrderCardFooter";
import OrderStatusBadge from "./OrderStatusBadge";
import { MinecraftItem } from "@/components/ui/MinecraftItem";

interface SellOrderCardProps {
  order: SellOrder;
  isOwn?: boolean;
  onCancel?: CancelHandler;
}

export default function SellOrderCard({ order, isOwn, onCancel }: SellOrderCardProps) {
  const { seymour } = order;
  const isActive = order.status === OrderStatus.ACTIVE;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] transition-colors relative">
      {isOwn && <OrderStatusBadge status={order.status} />}

      <Link href={`/hex/${seymour.hex_color}`} prefetch={false} className="flex items-center gap-3">
        <MinecraftItem piece={seymour.item_name} hex={seymour.hex_color} scale={3} />
        <div className="flex flex-col min-w-0">
          <span
            className="text-[12px] font-bold truncate"
            style={{ color: `#${seymour.hex_color}` }}
          >
            #{seymour.hex_color}
          </span>
          <span className="text-[#888] text-[10px]">
            {PIECE_SLOT_NAMES[seymour.item_name]}
          </span>
          {seymour.match && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[#5865F2] text-[9px] truncate">{seymour.match.target_name}</span>
              <span className="text-[#666] text-[9px] shrink-0">ΔE: {seymour.match.delta_e}</span>
            </div>
          )}
        </div>
      </Link>

      <OrderCardFooter
        price={order.price}
        expiresAt={order.expires_at}
        action={
          isOwn
            ? isActive && onCancel && <CancelOrderButton onCancel={onCancel} />
            : order.user && <DiscordUserLink user={order.user} />
        }
      />
    </div>
  );
}
