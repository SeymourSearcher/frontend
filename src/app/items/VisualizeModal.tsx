"use client";

import { useState, useCallback } from "react";
import { fetchVisualizationStats, fetchVisualizationHtml } from "@/lib/api";
import type { VisualizationRequest, VisualizationStats } from "@/types/visualization";
import { PieceIndex } from "@/lib/pieces";

type HexMode = "my" | "all";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userHexes?: string[];
  userSeymours?: [string, PieceIndex][];
  userHexesReady: boolean;
}

export default function VisualizeModal({
  isOpen,
  onClose,
  userHexes = [],
  userSeymours = [],
  userHexesReady,
}: Props) {
  const [hexMode, setHexMode] = useState<HexMode>("my");
  const [includeDyes, setIncludeDyes] = useState(true);
  const [respectPiece, setRespectPiece] = useState(true);
  const [minDe, setMinDe] = useState("0");
  const [maxDe, setMaxDe] = useState("5");
  const [stats, setStats] = useState<VisualizationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildRequest = useCallback((): VisualizationRequest => {
    const base = { min_de: parseFloat(minDe) || 0, max_de: parseFloat(maxDe) || 0, include_dyes: includeDyes };
    if (hexMode === "my") {
      if (respectPiece && userSeymours.length > 0) {
        return { ...base, input_seymours: userSeymours };
      }
      if (userHexes.length > 0) {
        return { ...base, input_hex_codes: userHexes };
      }
    }
    return base;
  }, [hexMode, userHexes, userSeymours, includeDyes, respectPiece, minDe, maxDe]);

  const handlePreview = async () => {
    setLoading(true);
    setError(null);

    const result = await fetchVisualizationStats(buildRequest());
    if (result.ok) {
      setStats(result.data);
    } else {
      setError(result.detail);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    const result = await fetchVisualizationHtml({ ...buildRequest(), max_points: 200000 });
    if (result.ok) {
      const blob = new Blob([result.data], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `color_cube_de${parseFloat(minDe) || 0}-${parseFloat(maxDe) || 0}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      setError(result.detail);
    }
    setDownloading(false);
  };

  const resetState = () => {
    setStats(null);
    setError(null);
  };

  if (!isOpen) return null;

  const hasUserHexes = userHexes.length > 0;
  // Without inputs the request silently becomes the full-RGB one, labelled as yours.
  const waitingForHexes = hexMode === "my" && !hasUserHexes;
  const inputCount = hexMode === "my"
    ? (respectPiece ? userSeymours.length : userHexes.length)
    : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md border border-[#333]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#f0f0f0] text-[16px]">Color Space Visualizer</h2>
          <button onClick={onClose} className="text-[#888] hover:text-white text-[20px]">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#ccc] text-[12px] block mb-2">Input Colors</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setHexMode("my"); resetState(); }}
                disabled={!hasUserHexes}
                className={`px-3 py-1 rounded text-[12px] ${
                  hexMode === "my" ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                My Hexes {hasUserHexes && `(${inputCount})`}
              </button>
              <button
                onClick={() => { setHexMode("all"); resetState(); }}
                className={`px-3 py-1 rounded text-[12px] ${
                  hexMode === "all" ? "bg-[#5865F2] text-white" : "bg-[#333] text-[#ccc] hover:bg-[#444]"
                }`}
              >
                All Hexes
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDyes}
                onChange={(e) => { setIncludeDyes(e.target.checked); resetState(); }}
                className="w-4 h-4 accent-[#5865F2]"
              />
              <span className="text-[12px] text-[#ccc]">Include Dyes</span>
            </label>

            {hexMode === "my" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={respectPiece}
                  onChange={(e) => { setRespectPiece(e.target.checked); resetState(); }}
                  className="w-4 h-4 accent-[#5865F2]"
                />
                <span className="text-[12px] text-[#ccc]">Respect Piece Type</span>
              </label>
            )}
          </div>

          <div>
            <label className="text-[#ccc] text-[12px] block mb-2">Delta E Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                inputMode="decimal"
                value={minDe}
                onChange={(e) => { setMinDe(e.target.value); resetState(); }}
                className="w-20 bg-[#252525] border border-[#444] rounded px-2 py-1 text-[#f0f0f0] text-[12px]"
              />
              <span className="text-[#888] text-[12px]">to</span>
              <input
                type="text"
                inputMode="decimal"
                value={maxDe}
                onChange={(e) => { setMaxDe(e.target.value); resetState(); }}
                className="w-20 bg-[#252525] border border-[#444] rounded px-2 py-1 text-[#f0f0f0] text-[12px]"
              />
            </div>
          </div>

          <button
            onClick={handlePreview}
            disabled={loading || waitingForHexes}
            className="w-full bg-[#333] hover:bg-[#444] text-[#ccc] py-2 rounded text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Calculating..."
              : waitingForHexes
                ? userHexesReady
                  ? "No seymours to visualize"
                  : "Loading your hexes..."
                : "Calculate Stats"}
          </button>

          {error && <p className="text-red-400 text-[12px]">{error}</p>}

          {stats && (
            <div className="bg-[#252525] rounded p-3 space-y-1">
              <p className="text-[#f0f0f0] text-[14px]">
                {stats.count.toLocaleString()} colors ({stats.percentage.toFixed(4)}%)
              </p>
              <p className="text-[#888] text-[11px]">
                out of {stats.total.toLocaleString()} {hexMode === "my" ? "of your seymours" : "possible RGB values"}
              </p>
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading || !stats}
            className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white py-2 rounded text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? "Generating..." : "Download 3D Visualization"}
          </button>
        </div>
      </div>
    </div>
  );
}
