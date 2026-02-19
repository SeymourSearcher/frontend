import { BuyOrder, OrderType, OrderStatus } from "@/types/marketplace";
import { PIECE_NAMES, formatTimeRemaining } from "./constants";

interface OrderCardProps {
  order: BuyOrder;
  isOwn?: boolean;
  onCancel?: () => void;
}

function getDiscordDmUrl(discordId: number): string {
  return `https://discord.com/users/${discordId}`;
}

function TypeBadge({ isSetPiece }: { isSetPiece: boolean }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
        isSetPiece
          ? "bg-purple-600/30 text-purple-300"
          : "bg-blue-600/30 text-blue-300"
      }`}
    >
      {isSetPiece ? "Set Piece" : "Hex Pattern"}
    </span>
  );
}

function CriteriaDisplay({ order }: { order: BuyOrder }) {
  const isSetPiece = order.order_type === OrderType.SET_PIECE;

  if (isSetPiece && order.set_criteria) {
    const { set_name, piece_types, tier } = order.set_criteria;
    const pieceNames = piece_types.map((pt) => PIECE_NAMES[pt]).join(", ");
    return (
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-bold text-purple-300 truncate">{set_name}</span>
        <span className="text-[#888] text-[10px] truncate">{pieceNames}</span>
        <span className="text-[#666] text-[9px]">Tier: {tier.toUpperCase()}</span>
      </div>
    );
  }

  if (!isSetPiece && order.hex_criteria) {
    const { hex_value, match_type, max_delta_e, piece_type } = order.hex_criteria;
    return (
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-bold truncate" style={{ color: `#${hex_value}` }}>
          #{hex_value}
        </span>
        <span className="text-[#888] text-[10px]">
          {match_type}{piece_type !== null && ` · ${PIECE_NAMES[piece_type]}`}
        </span>
        {max_delta_e !== null && (
          <span className="text-[#666] text-[9px]">Max ΔE: {max_delta_e}</span>
        )}
      </div>
    );
  }

  return null;
}

export default function OrderCard({ order, isOwn, onCancel }: OrderCardProps) {
  const isSetPiece = order.order_type === OrderType.SET_PIECE;
  const isActive = order.status === OrderStatus.ACTIVE;
  const hexValue = order.hex_criteria?.hex_value;

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

      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-md shrink-0 flex items-center justify-center"
          style={{
            backgroundColor: hexValue ? `#${hexValue}` : "#2a2a2a",
          }}
        >
          {isSetPiece && (
            <span className="text-purple-300 text-[10px] font-bold">SET</span>
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TypeBadge isSetPiece={isSetPiece} />
          </div>
          <CriteriaDisplay order={order} />
        </div>
      </div>

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
            onClick={onCancel}
            className="px-3 py-1.5 rounded text-[10px] bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors border-none cursor-pointer shrink-0"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
