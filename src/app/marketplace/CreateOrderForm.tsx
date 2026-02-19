"use client";

import { useState } from "react";
import { OrderType, HexMatchType, Tier, BuyOrderCreate } from "@/types/marketplace";
import { PIECE_NAMES } from "./constants";

interface CreateOrderFormProps {
  sets: string[];
  setPieces: Record<string, number[]>;
  onSubmit: (data: BuyOrderCreate) => Promise<void>;
  onClose: () => void;
}

function ToggleButton({
  selected,
  onClick,
  disabled,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const baseClass = "py-2 rounded text-[11px] border-none transition-colors";
  const stateClass = disabled
    ? "bg-[#222] text-[#555] cursor-not-allowed line-through"
    : selected
    ? "bg-[#5865F2] text-white cursor-pointer"
    : "bg-[#333] text-[#ccc] hover:bg-[#444] cursor-pointer";

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClass} ${stateClass} ${className}`}
    >
      {children}
    </button>
  );
}

function PieceSelector({
  selectedPieces,
  availablePieces,
  onToggle,
  allowMultiple = true,
}: {
  selectedPieces: number[];
  availablePieces: number[];
  onToggle: (piece: number) => void;
  allowMultiple?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {PIECE_NAMES.map((name, idx) => {
        const isAvailable = availablePieces.includes(idx);
        const isSelected = selectedPieces.includes(idx);
        return (
          <ToggleButton
            key={idx}
            selected={isSelected}
            disabled={!isAvailable}
            onClick={() => onToggle(idx)}
          >
            {name}
          </ToggleButton>
        );
      })}
    </div>
  );
}

function HexPieceSelector({
  selectedPieces,
  anySelected,
  onToggle,
  onToggleAny,
}: {
  selectedPieces: number[];
  anySelected: boolean;
  onToggle: (piece: number) => void;
  onToggleAny: () => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      <ToggleButton selected={anySelected} onClick={onToggleAny}>
        Any
      </ToggleButton>
      {PIECE_NAMES.map((name, idx) => (
        <ToggleButton
          key={idx}
          selected={selectedPieces.includes(idx)}
          onClick={() => onToggle(idx)}
          disabled={anySelected}
        >
          {name}
        </ToggleButton>
      ))}
    </div>
  );
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
  const [selectedPieceTypes, setSelectedPieceTypes] = useState<number[]>([]);
  const [tier, setTier] = useState<Tier>(Tier.T1);
  const [hexMatchType, setHexMatchType] = useState<HexMatchType>(HexMatchType.EXACT);
  const [hexValue, setHexValue] = useState("");
  const [maxDeltaE, setMaxDeltaE] = useState("");
  const [hexPieceTypes, setHexPieceTypes] = useState<number[]>([]);
  const [hexAnyPiece, setHexAnyPiece] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const availablePieces = setPieces[setName] || [];

  function handlePieceToggle(piece: number) {
    setSelectedPieceTypes((prev) =>
      prev.includes(piece)
        ? prev.filter((p) => p !== piece)
        : [...prev, piece]
    );
  }

  function handleHexPieceToggle(piece: number) {
    setHexPieceTypes((prev) =>
      prev.includes(piece)
        ? prev.filter((p) => p !== piece)
        : [...prev, piece]
    );
  }

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

    const priceNum = parseInt(price, 10);
    if (!priceNum || priceNum <= 0) {
      setError("Price must be a positive number");
      return;
    }

    if (orderType === OrderType.SET_PIECE) {
      if (!setName) {
        setError("Please select a set");
        return;
      }
      if (selectedPieceTypes.length === 0) {
        setError("Please select at least one piece type");
        return;
      }

      setSubmitting(true);
      try {
        const data: BuyOrderCreate = {
          price: priceNum,
          order_type: orderType,
          set_criteria: { set_name: setName, piece_types: selectedPieceTypes, tier },
        };
        await onSubmit(data);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create order");
      } finally {
        setSubmitting(false);
      }
    } else {
      const cleanHex = hexValue.replace("#", "").toUpperCase();
      if (cleanHex.length !== 6) {
        setError("Hex value must be 6 characters");
        return;
      }

      if (!hexAnyPiece && hexPieceTypes.length === 0) {
        setError("Please select at least one piece type or choose 'Any'");
        return;
      }

      const piecesToCreate = hexAnyPiece ? [null] : hexPieceTypes;

      setSubmitting(true);
      try {
        for (const pieceType of piecesToCreate) {
          const data: BuyOrderCreate = {
            price: priceNum,
            order_type: orderType,
            hex_criteria: {
              match_type: hexMatchType,
              hex_value: cleanHex,
              max_delta_e:
                hexMatchType === HexMatchType.DELTA_E
                  ? parseFloat(maxDeltaE) || null
                  : null,
              piece_type: pieceType,
            },
          };
          await onSubmit(data);
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create order");
      } finally {
        setSubmitting(false);
      }
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
            <label className="block text-[#888] text-[12px] mb-1">Order Type</label>
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
            <label className="block text-[#888] text-[12px] mb-1">Price (coins)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-[#f0f0f0] text-[13px] outline-none focus:border-[#5865F2]"
              min="1"
              required
            />
          </div>

          {orderType === OrderType.SET_PIECE ? (
            <>
              <div>
                <label className="block text-[#888] text-[12px] mb-1">Set Name</label>
                <select
                  value={setName}
                  onChange={(e) => handleSetChange(e.target.value)}
                  className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-[#f0f0f0] text-[13px] outline-none focus:border-[#5865F2]"
                  required
                >
                  {sets.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#888] text-[12px] mb-1">
                  Piece Types ({selectedPieceTypes.length} selected)
                </label>
                <PieceSelector
                  selectedPieces={selectedPieceTypes}
                  availablePieces={availablePieces}
                  onToggle={handlePieceToggle}
                />
                {availablePieces.length < 4 && (
                  <p className="text-[#666] text-[10px] mt-1">
                    Crossed out pieces are not available for this set
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#888] text-[12px] mb-1">Tier</label>
                <div className="flex gap-2">
                  {Object.values(Tier).map((t) => (
                    <ToggleButton
                      key={t}
                      selected={tier === t}
                      onClick={() => setTier(t)}
                      className="flex-1 text-[12px]"
                    >
                      {t.toUpperCase()}
                    </ToggleButton>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[#888] text-[12px] mb-1">Match Type</label>
                <div className="flex gap-2">
                  {Object.values(HexMatchType).map((mt) => (
                    <ToggleButton
                      key={mt}
                      selected={hexMatchType === mt}
                      onClick={() => setHexMatchType(mt)}
                      className="flex-1"
                    >
                      {mt === HexMatchType.DELTA_E
                        ? "Delta E"
                        : mt.charAt(0).toUpperCase() + mt.slice(1)}
                    </ToggleButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#888] text-[12px] mb-1">Hex Value</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={hexValue}
                    onChange={(e) =>
                      setHexValue(e.target.value.replace("#", "").slice(0, 6))
                    }
                    placeholder="FFFFFF"
                    className="flex-1 bg-[#252525] border border-[#333] rounded px-3 py-2 text-[#f0f0f0] text-[13px] outline-none focus:border-[#5865F2] uppercase"
                    maxLength={6}
                    required
                  />
                  {hexValue.length === 6 && (
                    <span
                      className="w-8 h-8 rounded border border-[#444]"
                      style={{ backgroundColor: `#${hexValue}` }}
                    />
                  )}
                </div>
              </div>

              {hexMatchType === HexMatchType.DELTA_E && (
                <div>
                  <label className="block text-[#888] text-[12px] mb-1">Max Delta E</label>
                  <input
                    type="number"
                    value={maxDeltaE}
                    onChange={(e) => setMaxDeltaE(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-[#f0f0f0] text-[13px] outline-none focus:border-[#5865F2]"
                    step="0.1"
                    min="0"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#888] text-[12px] mb-1">
                  Piece Types {!hexAnyPiece && `(${hexPieceTypes.length} selected)`}
                </label>
                <HexPieceSelector
                  selectedPieces={hexPieceTypes}
                  anySelected={hexAnyPiece}
                  onToggle={handleHexPieceToggle}
                  onToggleAny={handleHexAnyToggle}
                />
              </div>
            </>
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
