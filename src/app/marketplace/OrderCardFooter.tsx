import { ReactNode } from "react";
import { formatTimeRemaining } from "./constants";

interface OrderCardFooterProps {
  price: number;
  expiresAt: string;
  /** Right-hand slot: seller link, cancel button, or nothing. */
  action?: ReactNode;
}

export default function OrderCardFooter({ price, expiresAt, action }: OrderCardFooterProps) {
  return (
    <div className="border-t border-[#333] mt-3 pt-3 flex items-center justify-between gap-2">
      <div className="flex flex-col min-w-0">
        <div className="text-[#4ade80] font-bold text-[13px]">
          {price.toLocaleString()} coins
        </div>
        <div className="text-[#666] text-[9px]">{formatTimeRemaining(expiresAt)}</div>
      </div>
      {action}
    </div>
  );
}
