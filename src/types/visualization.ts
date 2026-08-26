import type { PieceIndex } from "@/lib/pieces";

export interface VisualizationRequest {
  min_de: number;
  max_de: number;
  input_hex_codes?: string[];
  input_seymours?: [string, PieceIndex][];
  include_dyes: boolean;
  max_points?: number;
}

export interface VisualizationStats {
  count: number;
  total: number;
  percentage: number;
}
