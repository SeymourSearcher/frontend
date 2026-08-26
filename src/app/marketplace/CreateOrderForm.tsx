"use client";

import { useState } from "react";
import { OrderType, HexMatchType, Tier, BuyOrderCreate } from "@/types/marketplace";
import { PieceIndex } from "@/lib/pieces";
import { ToggleButton } from "./ToggleButton";
import { SetPieceFields } from "./SetPieceFields";
import { HexPatternFields } from "./HexPatternFields";
import { buildBuyOrders } from "./buildBuyOrders";
import { INPUT_CLASS, LABEL_CLASS } from "./formStyles";

interface CreateOrderFormProps {
  sets: string[];
  setPieces: Record<string, PieceIndex[]>;
  onSubmit: (data: BuyOrderCreate) => Promise<void>;
  onClose: () => void;
}

function togglePiece(pieces: PieceIndex[], piece: PieceIndex): PieceIndex[] {
  return pieces.includes(piece) ? pieces.filter((p) => p !== piece) : [...pieces, piece];
}

export default function CreateOrderForm({
  sets,
  setPieces,
  onSubmit,
  onClose,
}: CreateOrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.SET_PIECE);
  const [price, setPrice] = useState("");
  const [setName, setSetName] = useState(sets[0] || "");
  const [selectedPieceTypes, setSelectedPieceTypes] = useState<PieceIndex[]>([]);
  const [tier, setTier] = useState<Tier>(Tier.T1);
  const [hexMatchType, setHexMatchType] = useState<HexMatchType>(HexMatchType.EXACT);
  const [hexValue, setHexValue] = useState("");
  const [maxDeltaE, setMaxDeltaE] = useState("");
  const [hexPieceTypes, setHexPieceTypes] = useState<PieceIndex[]>([]);
  const [hexAnyPiece, setHexAnyPiece] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const availablePieces = setPieces[setName] || [];

  function handleHexAnyToggle() {
    setHexAnyPiece((prev) => !prev);
    if (!hexAnyPiece) {
      setHexPieceTypes([]);
    }
  }

  function handleSetChange(newSetName: string) {
    setSetName(newSetName);
    const newAvailable = setPieces[newSetName] || [];
    setSelectedPieceTypes((prev) => prev.filter((p) => newAvailable.includes(p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = buildBuyOrders({
      orderType,
      price,
      setName,
      selectedPieceTypes,
      tier,
      hexMatchType,
      hexValue,
      maxDeltaE,
      hexPieceTypes,
      hexAnyPiece,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitting(true);
    try {
      for (const order of result.orders) {
        await onSubmit(order);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f0f0f0] text-[16px]">Create Buy Order</h2>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#ccc] text-[20px] bg-transparent border-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Order Type</label>
            <div className="flex gap-2">
              <ToggleButton
                selected={orderType === OrderType.SET_PIECE}
                onClick={() => setOrderType(OrderType.SET_PIECE)}
                className="flex-1 text-[12px]"
              >
                Set Piece
              </ToggleButton>
              <ToggleButton
                selected={orderType === OrderType.HEX_PATTERN}
                onClick={() => setOrderType(OrderType.HEX_PATTERN)}
                className="flex-1 text-[12px]"
              >
                Hex Pattern
              </ToggleButton>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Price (coins)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className={`w-full ${INPUT_CLASS}`}
              min="1"
              required
            />
          </div>

          {orderType === OrderType.SET_PIECE ? (
            <SetPieceFields
              sets={sets}
              setName={setName}
              availablePieces={availablePieces}
              selectedPieceTypes={selectedPieceTypes}
              tier={tier}
              onSetNameChange={handleSetChange}
              onPieceToggle={(piece) => setSelectedPieceTypes((prev) => togglePiece(prev, piece))}
              onTierChange={setTier}
            />
          ) : (
            <HexPatternFields
              hexMatchType={hexMatchType}
              hexValue={hexValue}
              maxDeltaE={maxDeltaE}
              hexPieceTypes={hexPieceTypes}
              hexAnyPiece={hexAnyPiece}
              onHexMatchTypeChange={setHexMatchType}
              onHexValueChange={setHexValue}
              onMaxDeltaEChange={setMaxDeltaE}
              onHexPieceToggle={(piece) => setHexPieceTypes((prev) => togglePiece(prev, piece))}
              onHexAnyToggle={handleHexAnyToggle}
            />
          )}

          {error && <p className="text-red-400 text-[12px]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded text-[13px] bg-[#5865F2] text-white border-none cursor-pointer hover:bg-[#4752C4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Creating..."
              : orderType === OrderType.HEX_PATTERN && !hexAnyPiece && hexPieceTypes.length > 1
              ? `Create ${hexPieceTypes.length} Orders`
              : "Create Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
