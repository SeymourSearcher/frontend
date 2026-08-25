import { BuyOrder, OrderType } from "@/types/marketplace";
import { PIECE_SLOT_NAMES } from "@/lib/pieces";

interface OrderCriteriaProps {
  order: BuyOrder;
  /** Pins the block height so cards sitting in a grid row line up. */
  fixedHeight?: boolean;
}

export default function OrderCriteria({ order, fixedHeight }: OrderCriteriaProps) {
  const className = `flex flex-col min-w-0${fixedHeight ? " h-[42px]" : ""}`;
  const isSetPiece = order.order_type === OrderType.SET_PIECE;

  if (isSetPiece && order.set_criteria) {
    const { set_name, piece_types, tier } = order.set_criteria;
    return (
      <div className={className}>
        <span className="text-[12px] font-bold text-purple-300 truncate">{set_name}</span>
        <span className="text-[#888] text-[10px] truncate">
          {piece_types.map((pt) => PIECE_SLOT_NAMES[pt]).join(", ")}
        </span>
        <span className="text-[#666] text-[9px]">Tier: {tier.toUpperCase()}</span>
      </div>
    );
  }

  if (!isSetPiece && order.hex_criteria) {
    const { hex_value, match_type, max_delta_e, piece_type } = order.hex_criteria;
    return (
      <div className={className}>
        <span className="text-[12px] font-bold truncate" style={{ color: `#${hex_value}` }}>
          #{hex_value}
        </span>
        <span className="text-[#888] text-[10px]">
          {match_type}{piece_type !== null && ` · ${PIECE_SLOT_NAMES[piece_type]}`}
        </span>
        {max_delta_e !== null && (
          <span className="text-[#666] text-[9px]">Max ΔE: {max_delta_e}</span>
        )}
      </div>
    );
  }

  return null;
}
